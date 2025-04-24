export interface LocationState {
	message?: string;
	severity?: "error" | "warning" | "info" | "success";
}

export interface ApiError {
	response?: {
		data?: {
			status: "error";
			message: string;
			errors: {
				[key: string]: string[];
			};
		};
	};
}

export interface Column<T> {
	key: keyof T;
	title: string;
	align?: "left" | "center" | "right";
	width?: number | string;
	tooltip?: boolean;
	render?: (value: T[keyof T], record: T) => React.ReactNode;
}

export interface ValidationErrors {
	[key: string]: string;
}

export interface CarouselProps {
	title: string;
	fetchData: () => Promise<MovieProps[]>;
	hasBackground?: boolean;
}

export interface MovieProps {
	id: number;
	title: string;
	duration_label: string;
	release_date_label: string;
	country: string;
	rating: string;
	genres: string;
	banner_url: string;
	poster_url: string;
	duration: string;
	trailer_url: string;
	age_rating: "P" | "K" | "T13" | "T16" | "T18";
	slug: string;
	description: string;
	is_now_showing: boolean;
}

export interface CityProps {
	id: number;
	name: string;
	cinemas?: CinemaProps[];
}

export interface ShowtimeProps {
	id: number;
	room: {
		name: string;
		seats: SeatProps[];
	};
	start_time: string;
	end_time: string;
	date: string;
}

export interface RegisterFormProps {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	city_id: string | number;
	password: string;
	password_confirmation: string;
}

export interface CinemaProps {
	id: number;
	name: string;
	address: string;
	phone: string;
	slug: string;
	opening_hours: string;
	image: string;

	city?: {
		id: number;
		name: string;
	};
}

export interface RoomProps {
	id: number;
	cinema_id: number;
	cinema_name: string;
	name: string;
	seat_rows: number;
	seat_columns: number;
	sweetbox_rows: number;
}

export interface SeatProps {
	id: number;
	room_id: number;
	seat_code: string;
	seat_type: "normal" | "vip" | "sweetbox";
	is_sweetbox: boolean;
	price: number;
}
