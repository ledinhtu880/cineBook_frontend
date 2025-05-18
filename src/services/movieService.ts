import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import type { MovieProps } from "@/types";

interface MovieQueryParams {
	limit?: number;
	sort?: string;
	order?: "asc" | "desc";
	q?: string;
	g?: string[];
}

let nowShowingCache: MovieProps | null = null;
let comingSoonCache: MovieProps | null = null;
let movieBySlugCache: MovieProps | null = null;

const movieService = {
	getMovies: async () => {
		const response = await axios.get(`${API_URL}/admin/movies`);
		return response.data.data;
	},

	getNowShowingMovies: async () => {
		if (nowShowingCache) return nowShowingCache;

		const response = await axios.get(`${API_URL}/movies/now-showing`);

		const data = response.data.data;
		nowShowingCache = data;

		return data;
	},

	getTopRatedNowShowingMovies: async (params?: MovieQueryParams) => {
		const response = await axios.get(`${API_URL}/movies/now-showing`, {
			params,
		});

		return response.data.data;
	},

	getComingSoonMovies: async () => {
		if (comingSoonCache) return comingSoonCache;

		const response = await axios.get(`${API_URL}/movies/coming-soon`);

		const data = response.data.data;
		comingSoonCache = data;

		return data;
	},

	search: async (params: MovieQueryParams) => {
		const response = await axios.get(`${API_URL}/movies/`, {
			params,
		});
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
		if (movieBySlugCache && movieBySlugCache.slug === slug)
			return movieBySlugCache;

		const response = await axios.get(`${API_URL}/movies/${slug}`);
		const data = response.data.data;

		movieBySlugCache = data;

		return data;
	},

	getShowtimese: async (movieId: number) => {
		const response = await axios.get(`${API_URL}/movies/${movieId}/showtimes`);

		return response.data.data;
	},
};

export default movieService;
