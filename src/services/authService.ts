import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { RegisterFormData } from "@/types/";

export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

interface LoginResponse {
	status: string;
	message: string;
	data: {
		user: User;
		token: string;
	};
}

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
				localStorage.setItem("user", JSON.stringify(response.data.data.user));
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
			// Gọi API để vô hiệu hóa token
			await axios.post(
				`${API_URL}/auth/logout`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
		} finally {
			// Luôn xóa localStorage, kể cả khi API fail
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		}
	},

	getCurrentUser: () => {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : null;
	},

	isLoggedIn: () => {
		return !!localStorage.getItem("token") && !!localStorage.getItem("user");
	},
};

export default authService;
