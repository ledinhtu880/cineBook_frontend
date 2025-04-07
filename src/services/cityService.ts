import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const cityService = {
	get: async () => {
		const response = await axios.get(`${API_URL}/cities/`);
		return response.data;
	},
};

export default cityService;
