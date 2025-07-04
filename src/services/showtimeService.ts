import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const showtimeService = {
	get: async () => {
		const response = await axios.get(`${API_URL}/admin/showtimes`);
		return response.data.data;
	},

	create: async (data: FormData) => {
		const response = await axios.post(`${API_URL}/admin/showtimes`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	update: async (id: number, data: FormData) => {
		const response = await axios.put(`${API_URL}/admin/showtimes/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	delete: async (id: number) => {
		const response = await axios.delete(`${API_URL}/admin/showtimes/${id}`);
		return response.data.data;
	},

	show: async (id: number) => {
		const response = await axios.get(`${API_URL}/showtimes/${id}`);
		return response.data;
	},
};

export default showtimeService;
