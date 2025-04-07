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
				[key: string]: string[]; // Giữ nguyên array nhưng biết chắc chỉ có 1 phần tử
			};
		};
	};
}

export interface ValidationErrors {
	[key: string]: string;
}

export interface CarouselProps {
	title: string;
	fetchData: () => Promise<MovieProps[]>; // Function to fetch data
}

export interface MovieProps {
	id: string;
	title: string;
	description: string;
	release_date: string;
	duration: string;
	poster_url: string;
	trailer_url: string;
	age_rating: "P" | "K" | "T13" | "T16" | "T18";
}

export interface CityProps {
	id: string;
	name: string;
}

export interface RegisterFormData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	city_id: string;
	password: string;
	password_confirmation: string;
}

export interface Column<T> {
	key: keyof T;
	title: string;
	align?: "left" | "center" | "right";
	width?: number | string;
	tooltip?: boolean;
	render?: (value: T[keyof T], record: T) => React.ReactNode;
}
