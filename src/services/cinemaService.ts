import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

import type { CinemaProps, ShowtimeProps as Showtime } from "@/types";

interface ShowtimeProps {
	slug: string;
	showtimes: Showtime[];
}

let cinemaBySlugCache: CinemaProps | null = null;
let showtimeseBySlugCache: ShowtimeProps | null = null;

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
		return response.data;
	},

	update: async (id: number, data: FormData) => {
		data.append("_method", "PUT");

		const response = await axios.post(`${API_URL}/admin/cinemas/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	delete: async (id: number) => {
		const response = await axios.delete(`${API_URL}/admin/cinemas/${id}`);
		return response.data;
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
		return response.data;
	},

	getCinemaBySlug: async (slug: string) => {
		if (cinemaBySlugCache && cinemaBySlugCache.slug == slug)
			return cinemaBySlugCache;

		const response = await axios.get(
			`${API_URL}/cinemas/${slug}?get-city=true`
		);

		const data = response.data.data;
		cinemaBySlugCache = data;

		return data;
	},

	getShowtimese: async (slug: string) => {
		if (showtimeseBySlugCache && showtimeseBySlugCache.slug === slug)
			return showtimeseBySlugCache.showtimes;

		const response = await axios.get(`${API_URL}/cinemas/${slug}/showtimes`);

		const data = response.data.data;
		showtimeseBySlugCache = {
			slug: slug,
			showtimes: data,
		};

		return data;
	},
};

export default cinemaService;
