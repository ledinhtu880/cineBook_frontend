import axios from "axios";
import type { User } from "@/types";
const API_URL = import.meta.env.VITE_API_URL;

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
		const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
			email,
			password,
		});

		if (response.data.status === "success") {
			localStorage.setItem("token", response.data.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.data.user));
		}

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
		return !!localStorage.getItem("token");
	},
};

export default authService;
