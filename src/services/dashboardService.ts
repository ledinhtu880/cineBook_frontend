import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const dashboardService = {
	getDashboardData: async () => {
		const token = localStorage.getItem("token");

		const response = await axios.get(`${API_URL}/dashboard`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	},
};

export default dashboardService;
