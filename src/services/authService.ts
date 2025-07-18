import axios from "axios";

import type { RegisterFormProps, UserProps } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
	status: string;
	message: string;
	data: {
		user: UserProps;
		token: string;
	};
}

let userCache: UserProps | null = null;

const getTokenFromStorage = (): string | null => {
	return localStorage.getItem("token");
};

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

				localStorage.setItem("token", token);

				userCache = user;

				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			}

			return response.data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	},

	register: async (formData: RegisterFormProps) => {
		const response = await axios.post(`${API_URL}/auth/register`, formData);

		return response.data;
	},

	logout: async () => {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				await axios.post(`${API_URL}/auth/logout`, {
					headers: {
						Authorization: `Bearer ${getTokenFromStorage()}`,
						"Cache-Control": "no-cache",
					},
				});
			}
		} finally {
			localStorage.removeItem("token");

			userCache = null;

			delete axios.defaults.headers.common["Authorization"];
		}
	},

	getCurrentUser: async () => {
		try {
			if (userCache) return userCache;

			const response = await axios.get(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${getTokenFromStorage()}`,
					"Cache-Control": "no-cache",
				},
			});

			userCache = response.data.data;
			return response.data.data;
		} catch (error) {
			console.error("Error getting current user:", error);
			return null;
		}
	},

	update: async (data: UserProps) => {
		const token = localStorage.getItem("token");
		const response = await axios.put(`${API_URL}/auth/update-profile`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data;
	},

	isLoggedIn: () => {
		return !!localStorage.getItem("token");
	},

	setupAxiosInterceptors: () => {
		const token = getTokenFromStorage();
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
	},
	changePassword: async (
		currentPassword: string,
		newPassword: string,
		confirmPassword: string
	) => {
		const token = localStorage.getItem("token");
		const response = await axios.put(
			`${API_URL}/auth/change-password`,
			{
				currentPassword,
				newPassword,
				confirmPassword,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	},
};

// Thiết lập axios interceptors và cache khi import service
authService.setupAxiosInterceptors();

export default authService;
