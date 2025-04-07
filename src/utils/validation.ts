export interface ValidationRule {
	required?: boolean;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	email?: boolean;
	trailer_url?: boolean;
	match?: string;
	custom?: (value: unknown) => string | null;
	message?: string;
}

export interface ValidationRules {
	[key: string]: ValidationRule;
}

// Type cho form values
export type FormValues = {
	[key: string]: string | number | boolean | File | null | undefined;
};

export const validateField = (
	value: unknown,
	rules: ValidationRule
): string | null => {
	if (rules.required && !value) {
		return rules.message || "Trường này không được để trống";
	}

	if (value) {
		// Type guards
		if (rules.minLength && typeof value === "string") {
			if (value.length < rules.minLength) {
				return `Tối thiểu ${rules.minLength} ký tự`;
			}
		}

		if (rules.maxLength && typeof value === "string") {
			if (value.length > rules.maxLength) {
				return `Tối đa ${rules.maxLength} ký tự`;
			}
		}

		if (rules.min && typeof value === "number") {
			if (value < rules.min) {
				return `Giá trị tối thiểu là ${rules.min}`;
			}
		}

		if (rules.max && typeof value === "number") {
			if (value > rules.max) {
				return `Giá trị tối đa là ${rules.max}`;
			}
		}

		if (rules.email && typeof value === "string") {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				return "Email không hợp lệ";
			}
		}

		if (rules.trailer_url && typeof value === "string") {
			if (!/^https?:\/\/.*/.test(value)) {
				return "URL không hợp lệ";
			}
		}

		if (rules.pattern && typeof value === "string") {
			if (!rules.pattern.test(value)) {
				return rules.message || "Giá trị không hợp lệ";
			}
		}

		if (rules.custom) {
			return rules.custom(value);
		}
	}

	return null;
};

export const validateForm = (
	values: FormValues,
	rules: ValidationRules
): Record<string, string> => {
	const errors: Record<string, string> = {};

	Object.keys(rules).forEach((field) => {
		const error = validateField(values[field], rules[field]);
		if (error) {
			errors[field] = error;
		}
	});

	return errors;
};
