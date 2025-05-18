import axios from "axios";

import type  { CityProps } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

let productCombosCache: CityProps | null = null;

const productComboService = {
	get: async () => {
		if (productCombosCache) return productCombosCache;

		const response = await axios.get(`${API_URL}/combos/`);
		const data = response.data.data;
		productCombosCache = data;
		return data;
	},
};

export default productComboService;
