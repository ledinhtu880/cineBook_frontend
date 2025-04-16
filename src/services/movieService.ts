import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface MovieQueryParams {
	limit?: number;
	sort?: string;
	order?: "asc" | "desc";
}

const movieService = {
	getMovies: async () => {
		const response = await axios.get(`${API_URL}/admin/movies`);
		return response.data.data;
	},

	getNowShowingMovies: async (params?: MovieQueryParams) => {
		const response = await axios.get(`${API_URL}/movies/now-showing`, {
			params,
		});
		return response.data.data;
	},

	getComingSoonMovies: async () => {
		const response = await axios.get(`${API_URL}/movies/coming-soon`);
		return response.data.data;
	},

	create: async (data: FormData) => {
		const response = await axios.post(`${API_URL}/admin/movies`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	update: async (id: number, data: FormData) => {
		// Thêm _method field để Laravel hiểu đây là PUT request
		data.append("_method", "PUT");

		const response = await axios.post(`${API_URL}/admin/movies/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	delete: async (id: number) => {
		const response = await axios.delete(`${API_URL}/admin/movies/${id}`);
		return response.data.data;
	},

	show: async (id: number) => {
		const response = await axios.get(`${API_URL}/admin/movies/${id}`);
		return response.data.data;
	},

	getMovieBySlug: async (slug: string) => {
		const response = await axios.get(`${API_URL}/movies/${slug}`);
		return response.data.data;
	},
};

export default movieService;
