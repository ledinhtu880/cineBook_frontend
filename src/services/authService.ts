import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { RegisterFormData } from "@/types/";

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
				localStorage.setItem("token", response.data.data.token);
				userCache = response.data.data.user;

				// Cập nhật API configuration để tự động gửi token
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${response.data.data.token}`;
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
				await axios.post(`${API_URL}/auth/logout`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
		} finally {
			localStorage.removeItem("token");
			// Xóa user khỏi memory cache
			userCache = null;
			// Xóa token khỏi axios headers
			delete axios.defaults.headers.common["Authorization"];
		}
	},

	getCurrentUser: async () => {
		// Nếu có cache, trả về ngay lập tức
		if (userCache) {
			return userCache;
		}

		// Nếu có token nhưng chưa có cache, gọi API để lấy thông tin
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const response = await axios.get(`${API_URL}/auth/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				// Cập nhật cache
				userCache = response.data.data.user;
				return userCache;
			} catch (error) {
				console.error("Failed to get user info:", error);
				// Nếu token không hợp lệ, logout luôn
				if (axios.isAxiosError(error) && error.response?.status === 401) {
					console.log("Out");
					authService.logout();
				}
				return null;
			}
		}

		return null;
	},

	refreshUserData: async () => {
		const token = localStorage.getItem("token");
		if (!token) return null;

		try {
			const response = await axios.get(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			userCache = response.data.data.user;
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
		return !!localStorage.getItem("token") && !!localStorage.getItem("user");
	},

	setupAxiosInterceptors: () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
	},
};

// Thiết lập axios interceptors khi import service
authService.setupAxiosInterceptors();

// Khi load trang, lấy thông tin user nếu đã đăng nhập
(async () => {
	if (authService.isLoggedIn()) {
		await authService.getCurrentUser();
	}
})();

export default authService;
