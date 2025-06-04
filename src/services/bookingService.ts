import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface BookingData {
	user_id: number;
	showtime_id: number;
	seats: { id: number; price?: number }[];
	combos: { id: number; price: number; quantity: number }[];
	payment_method: string;
	total_amount: number;
	booking_time: string;
	returnUrl: string;
	cancelUrl: string;
}

let bookingCache: BookingData | null = null;

const bookingService = {
	get: async () => {
		if (bookingCache) return bookingCache;

		const token = localStorage.getItem("token");

		const response = await axios.get(`${API_URL}/bookings`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const data = response.data.data;
		bookingCache = data;

		return data;
	},

	create: async (data: BookingData) => {
		const token = localStorage.getItem("token");

		const response = await axios.post(`${API_URL}/bookings`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	},

	update: async (orderCode: number) => {
		const token = localStorage.getItem("token");

		const response = await axios.put(`${API_URL}/bookings/${orderCode}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	},
};

export default bookingService;
