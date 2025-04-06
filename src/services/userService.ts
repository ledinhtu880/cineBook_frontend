import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const userService = {
	// Get all users
	getUsers: async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/admin/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.status === "success") {
				return response.data.data;
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
