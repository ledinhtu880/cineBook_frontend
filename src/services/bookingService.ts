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

interface CheckoutData {
	orderCode: number;
	amount: number;
	description: string;
	returnUrl: string;
	cancelUrl: string;
}

const bookingService = {
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

		const response = await axios.post(`${API_URL}/bookings/${orderCode}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	},

	getInfoPayment: async (orderCode: number) => {
		const token = localStorage.getItem("token");

		const response = await axios.get(`${API_URL}/payment/${orderCode}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	},
};

export default bookingService;
