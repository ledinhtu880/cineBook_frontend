import axios from "axios";

import type { GenreProps } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

let genresCache: GenreProps | null = null;

const genreService = {
	get: async () => {
		if (genresCache) return genresCache;

		const response = await axios.get(`${API_URL}/genres/`);
		const data = response.data.data;
		genresCache = data;
		return data;
	},
};

export default genreService;
