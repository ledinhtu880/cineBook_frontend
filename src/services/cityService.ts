import axios from "axios";

import { CityProps } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

let citiesCache: CityProps | null = null;

const cityService = {
	get: async () => {
		if (citiesCache) return citiesCache;

		const response = await axios.get(`${API_URL}/cities/`);
		const data = response.data.data;
		citiesCache = data;
		return data;
	},
	getWithCinemas: async () => {
		const response = await axios.get(`${API_URL}/cities?with_cinemas=true`);
		return response.data.data;
	},
};

export default cityService;
