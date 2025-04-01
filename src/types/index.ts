export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
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
	duration: string;
	poster_url: string;
	trailer_url: string;
	age_rating: string;
}

export interface RegisterFormData {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	password_confirmation: string;
}
