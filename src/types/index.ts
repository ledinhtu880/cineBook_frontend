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
