import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const roomService = {
	delete: async (id: number) => {
		const response = await axios.delete(`${API_URL}/admin/rooms/${id}`);
		return response.data.data;
	},

	show: async (id: number) => {
		const response = await axios.get(`${API_URL}/admin/rooms/${id}`);
		return response.data.data;
	},
};

export default roomService;
