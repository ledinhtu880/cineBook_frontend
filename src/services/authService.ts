import axios from "axios";

import { RegisterFormData } from "@/types/";

const API_URL = import.meta.env.VITE_API_URL;
export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: boolean;
}

interface LoginResponse {
	status: string;
	message: string;
	data: {
		user: User;
		token: string;
	};
}

let userCache: User | null = null;

let currentUserRequest: Promise<User | null> | null = null;

const authService = {
	login: async (email: string, password: string) => {
		try {
			const response = await axios.post<LoginResponse>(
				`${API_URL}/auth/login`,
				{
					email,
					password,
				}
			);

			if (response.data.status === "success") {
				const token = response.data.data.token;
				const user = response.data.data.user;

				// Lưu token và thông tin user vào localStorage
				localStorage.setItem("token", token);

				// Cập nhật cache
				userCache = user;

				// Cập nhật API configuration để tự động gửi token
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			}

			return response.data;
		} catch (error) {
			// Bắt lỗi network hoặc validation
			console.error("Login error:", error);
			throw error;
		}
	},

	register: async (formData: RegisterFormData) => {
		const response = await axios.post(`${API_URL}/auth/register`, formData);

		return response.data;
	},

	logout: async () => {
		try {
			const token = localStorage.getItem("token");
			// Gọi API để vô hiệu hóa token
			if (token) {
				await axios.post(`${API_URL}/auth/logout`);
			}
		} finally {
			// Xóa dữ liệu khỏi localStorage
			localStorage.removeItem("token");

			// Xóa user khỏi memory cache
			userCache = null;
			currentUserRequest = null;

			// Xóa token khỏi axios headers
			delete axios.defaults.headers.common["Authorization"];
		}
	},

	getCurrentUser: async () => {
		if (userCache) {
			return userCache;
		}

		if (currentUserRequest) {
			return currentUserRequest;
		}

		const token = localStorage.getItem("token");
		if (token) {
			currentUserRequest = (async () => {
				try {
					const response = await axios.get(`${API_URL}/auth/me`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					userCache = response.data.data;
					return userCache;
				} catch (error) {
					console.error("Failed to get user info:", error);
					if (axios.isAxiosError(error) && error.response?.status === 401) {
						authService.logout();
					}
					return null;
				} finally {
					currentUserRequest = null;
				}
			})();

			return currentUserRequest;
		}

		return null;
	},

	refreshUserData: async () => {
		const token = localStorage.getItem("token");
		if (!token) return null;

		userCache = null;
		currentUserRequest = null;

		try {
			const response = await axios.get(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			userCache = response.data.data;
			return userCache;
		} catch (error) {
			console.error("Failed to refresh user data:", error);
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				authService.logout();
			}
			return null;
		}
	},

	isLoggedIn: () => {
		return !!localStorage.getItem("token");
	},

	setupAxiosInterceptors: () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}

		const userStr = localStorage.getItem("user");
		if (userStr) {
			try {
				userCache = JSON.parse(userStr);
			} catch (error) {
				console.error("Error parsing user from localStorage:", error);
				localStorage.removeItem("user");
			}
		}
	},
};

// Thiết lập axios interceptors và cache khi import service
authService.setupAxiosInterceptors();

export default authService;
