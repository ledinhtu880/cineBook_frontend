import { UserProps } from "@/types";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

let usersCache: UserProps | null = null;

const userService = {
	getUsers: async () => {
		try {
			if (usersCache) return usersCache;

			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/admin/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.status === "success") {
				usersCache = response.data.data;
				return usersCache;
			}

			throw new Error(response.data.message);
		} catch (error) {
			console.error("Error fetching users:", error);
			throw error;
		}
	},
	getUserById: async (id: number) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/admin/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw error;
		}
	},
};

export default userService;
