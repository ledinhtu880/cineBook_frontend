import { RegisterFormData } from "@/types/";

interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export function validatePassword(password: string): ValidationResult {
	const errors: string[] = [];

	// Kiểm tra độ dài tối thiểu
	if (!password) {
		errors.push("Mật khẩu không được để trống");
		return { isValid: false, errors };
	}

	if (password.length < 8) {
		errors.push("Mật khẩu phải có ít nhất 8 ký tự");
	}

	// Kiểm tra chữ hoa
	if (!/[A-Z]/.test(password)) {
		errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết hoa");
	}

	// Kiểm tra chữ thường
	if (!/[a-z]/.test(password)) {
		errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết thường");
	}

	// Kiểm tra số
	if (!/[0-9]/.test(password)) {
		errors.push("Mật khẩu phải chứa ít nhất một chữ số");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

// Hàm validate tổng hợp cho form đăng nhập
export function validateLoginForm(
	email: string,
	password: string
): Record<string, string> {
	const errors: Record<string, string> = {};

	// Validate email
	if (!email) {
		errors.email = "Email không được để trống";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = "Email không hợp lệ";
	}

	// Validate mật khẩu - chỉ kiểm tra cơ bản khi đăng nhập
	if (!password) {
		errors.password = "Mật khẩu không được để trống";
	}

	return errors;
}

// Hàm validate tổng hợp cho form đăng ký
export function validateRegisterForm(
	formData: RegisterFormData
): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!formData.first_name) {
		errors.first_name = "Tên không được để trống";
	}

	if (!formData.last_name) {
		errors.last_name = "Họ không được để trống";
	}
	// Validate email
	if (!formData.email) {
		errors.email = "Email không được để trống";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
		errors.email = "Email không hợp lệ";
	}

	// Validate mật khẩu - áp dụng đầy đủ quy tắc khi đăng ký
	const passwordValidation = validatePassword(formData.password);
	if (!passwordValidation.isValid) {
		errors.password = passwordValidation.errors[0]; // Chỉ lấy lỗi đầu tiên
	}

	// Validate nhập lại mật khẩu
	if (!formData.password_confirmation) {
		errors.password_confirmation = "Mật khẩu nhập lại không được để trống";
	} else if (formData.password !== formData.password_confirmation) {
		errors.password_confirmation = "Mật khẩu nhập lại không khớp";
	}

	return errors;
}
