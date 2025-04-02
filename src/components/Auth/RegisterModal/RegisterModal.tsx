import { useState } from "react";
import clsx from "clsx";

import styles from "../Auth.module.scss";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Image from "@/components/Image";
import { ValidationErrors, ApiError, RegisterFormData } from "@/types";
import { validateRegisterForm } from "@/utils/validation";
import authService from "@/services/authService";

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onOpenLogin: () => void;
	onRegisterSuccess: () => void;
}

const RegisterModal = ({
	isOpen,
	onClose,
	onOpenLogin,
	onRegisterSuccess,
}: RegisterModalProps) => {
	const [formData, setFormData] = useState<RegisterFormData>({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});
	const [errors, setErrors] = useState<ValidationErrors>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = validateRegisterForm(formData);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			await authService.register(formData);
			onRegisterSuccess();
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.response?.data?.errors) {
				const validationErrors = Object.entries(
					apiError.response.data.errors
				).reduce((acc, [key, messages]) => {
					return {
						...acc,
						[key]: Array.isArray(messages) ? messages[0] : messages,
					};
				}, {} as ValidationErrors);
				setErrors(validationErrors);
			} else {
				setErrors({ general: "Đã có lỗi xảy ra. Vui lòng thử lại." });
			}
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} width={450}>
			<Image
				alt="Icon Login"
				loading="lazy"
				className={clsx(styles["form-img"])}
				src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
			/>
			<h5 className={styles.title}>Đăng ký</h5>
			<form className={clsx(styles["form-wrapper"])} onSubmit={handleSubmit}>
				{errors.general && (
					<span className={styles["form-error"]}>{errors.general}</span>
				)}
				<div className="flex gap-4">
					<Input
						label="Họ"
						name="last_name"
						value={formData.last_name}
						error={errors.last_name}
						placeholder="Nhập họ"
						onChange={handleChange}
					/>
					<Input
						label="Tên"
						name="first_name"
						value={formData.first_name}
						error={errors.first_name}
						placeholder="Nhập tên"
						onChange={handleChange}
					/>
				</div>
				<Input
					label="Email"
					name="email"
					placeholder="Nhập email"
					error={errors.email}
					onChange={handleChange}
				/>
				<Input
					label="Mật khẩu"
					name="password"
					type="password"
					placeholder="Nhập mật khẩu"
					error={errors.password}
					onChange={handleChange}
				/>
				<Input
					label="Mật khẩu"
					name="password_confirmation"
					type="password"
					placeholder="Nhập lại mật khẩu"
					error={errors.password_confirmation}
					onChange={handleChange}
				/>
				<Button className={clsx(styles["btn-primary"])}>Đăng ký</Button>
			</form>
			<p className={clsx(styles["info"])}>Bạn đã có tài khoản?</p>
			<Button
				className={clsx(styles["btn-secondary"])}
				outline
				onClick={onOpenLogin}
			>
				Đăng nhập
			</Button>
		</Modal>
	);
};

export default RegisterModal;
