import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const movieService = {
	getMovies: async () => {
		const response = await axios.get(`${API_URL}/admin/movies`);
		return response.data.data;
	},

	getNowShowingMovies: async () => {
		const response = await axios.get(`${API_URL}/movies/now-showing`);
		return response.data;
	},

	getComingSoonMovies: async () => {
		const response = await axios.get(`${API_URL}/movies/coming-soon`);
		return response.data;
	},
};

export default movieService;
