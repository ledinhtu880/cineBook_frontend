import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { MovieProps } from "@/types";

interface MovieQueryParams {
	limit?: number;
	sort?: string;
	order?: "asc" | "desc";
}

let nowShowingCache: MovieProps | null = null;
let comingSoonCache: MovieProps | null = null;

const movieService = {
	getMovies: async () => {
		const response = await axios.get(`${API_URL}/admin/movies`);
		return response.data.data;
	},

	getNowShowingMovies: async (params?: MovieQueryParams) => {
		if (nowShowingCache) return nowShowingCache;

		const response = await axios.get(`${API_URL}/movies/now-showing`, {
			params,
		});

		const data = response.data.data;
		nowShowingCache = data;

		return data;
	},

	getComingSoonMovies: async () => {
		if (comingSoonCache) return comingSoonCache;

		const response = await axios.get(`${API_URL}/movies/coming-soon`);

		const data = response.data.data;
		comingSoonCache = data;

		return data;
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
