export interface LocationState {
	message?: string;
	severity?: "error" | "warning" | "info" | "success";
}

export interface LoginFormData {
	email: string;
	password: string;
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
	slug?: string;
	description?: string;
}

export interface CityProps {
	id: number;
	name: string;
	cinemas?: CinemaData[];
}

export interface RegisterFormData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	city_id: string | number;
	password: string;
	password_confirmation: string;
}

export interface CinemaData {
	id: number;
	name: string;
	address?: string;
	phone?: string;
}

export interface RoomData {
	id: number;
	cinema_id: number;
	cinema_name: string;
	name: string;
	seat_rows: number;
	seat_columns: number;
	sweetbox_rows: number;
}
