import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const cinemaService = {
	get: async (params: string | null) => {
		const response = await axios.get(`${API_URL}/admin/cinemas${params}`);
		return response.data.data;
	},

	create: async (data: FormData) => {
		const response = await axios.post(`${API_URL}/admin/cinemas`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	update: async (id: number, data: FormData) => {
		// Thêm _method field để Laravel hiểu đây là PUT request
		data.append("_method", "PUT");

		const response = await axios.post(`${API_URL}/admin/cinemas/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	delete: async (id: number) => {
		const response = await axios.delete(`${API_URL}/admin/cinemas/${id}`);
		return response.data.data;
	},

	show: async (id: number) => {
		const response = await axios.get(`${API_URL}/admin/cinemas/${id}`);
		return response.data.data;
	},

	getRooms: async (id: number) => {
		const response = await axios.get(`${API_URL}/admin/cinemas/${id}/rooms`);
		return response.data.data;
	},

	createRoom: async (id: number, data: FormData) => {
		const response = await axios.post(
			`${API_URL}/admin/cinemas/${id}/rooms`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data.data;
	},

	getCinemaBySlug: async (slug: string) => {
		const response = await axios.get(
			`${API_URL}/cinemas/${slug}?get-city=true`
		);
		return response.data.data;
	},

	getShowtimese: async (slug: string) => {
		const response = await axios.get(`${API_URL}/cinemas/${slug}/showtimes`);
		return response.data.data;
	},
};

export default cinemaService;
