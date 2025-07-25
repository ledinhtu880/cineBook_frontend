import type { RegisterFormProps } from "@/types";

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

function validatePhoneNumber(phone: string): string | null {
	// Kiểm tra số điện thoại rỗng
	if (!phone) {
		return "Số điện thoại không được để trống";
	}

	// Format: +84xxxxxxxxx hoặc 0xxxxxxxxx (x là số)
	const phoneRegex = /^(?:\+84|0)[1-9]\d{8,9}$/;
	if (!phoneRegex.test(phone)) {
		return "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)";
	}

	return null;
}

function validateCityId(cityId: string | number | null): string | null {
	if (!cityId) {
		return "Vui lòng chọn thành phố";
	}
	return null;
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

	const passwordValidation = validatePassword(password);
	if (!passwordValidation.isValid) {
		errors.password = passwordValidation.errors[0]; // Chỉ lấy lỗi đầu tiên
	}

	return errors;
}

// Hàm validate tổng hợp cho form đăng ký
export function validateRegisterForm(
	formData: RegisterFormProps
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

	const phoneError = validatePhoneNumber(formData.phone);
	if (phoneError) {
		errors.phone = phoneError;
	}

	// Validate city
	const cityError = validateCityId(formData.city_id);
	if (cityError) {
		errors.city_id = cityError;
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

export function validateChangePasswordForm(
	currentPassword: string,
	newPassword: string,
	confirmPassword: string
): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!currentPassword) {
		errors.currentPassword = "Mật khẩu hiện tại không được để trống";
	}

	const newPasswordValidation = validatePassword(newPassword);
	if (!newPasswordValidation.isValid) {
		errors.newPassword = newPasswordValidation.errors[0]; // Chỉ lấy lỗi đầu tiên
	}

	if (!confirmPassword) {
		errors.confirmPassword = "Mật khẩu xác nhận không được để trống";
	} else if (newPassword !== confirmPassword) {
		errors.confirmPassword = "Mật khẩu xác nhận không khớp";
	}

	return errors;
}
