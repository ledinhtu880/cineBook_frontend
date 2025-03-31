export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

export interface ApiError {
	response?: {
		data?: {
			errors?: Record<string, string[]>;
			message?: string;
		};
	};
}

export interface ValidationErrors {
	[key: string]: string;
}

export interface CarouselProps {
	title: string;
}

export interface MovieProps {
	id: string;
	title: string;
	duration: string;
	poster_url: string;
	trailer_url: string;
	age_rating: string;
}
