import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "../Auth.module.scss";
import config from "@/config";
import { authService } from "@/services";
import type { ApiError, ValidationErrors } from "@/types";
import { validateLoginForm } from "@/utils/authValidation";
import { Button, Input, Image, Modal } from "@/components";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLoginSuccess: () => void;
	onOpenRegister?: () => void;
	isHaveRegister?: boolean;
}

const LoginModal = ({
	isOpen,
	onClose,
	onLoginSuccess,
	onOpenRegister,
	isHaveRegister = true,
}: LoginModalProps) => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}

		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validate form
		const validationErrors = validateLoginForm(email, password);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await authService.login(email, password);
			onLoginSuccess();
			onClose();
			if (response.data.user.role) {
				navigate(config.routes.admin_dashboard);
			}
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
				setErrors({ general: "Có lỗi xảy ra khi đăng nhập" });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			{isHaveRegister && (
				<>
					<Image
						alt="Icon Login"
						loading="lazy"
						className={clsx(styles["form-img"])}
						src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
					/>
					<h5 className={clsx(styles.title)}>Đăng nhập</h5>
				</>
			)}
			<form className={clsx(styles["form-wrapper"])} onSubmit={handleSubmit}>
				{errors.general && (
					<span className={clsx(styles["form-error"])}>{errors.general}</span>
				)}
				<Input
					label="Email"
					name="email"
					type="email"
					placeholder="Nhập email"
					value={email}
					error={errors.email}
					onChange={handleChange}
				/>
				<Input
					label="Mật khẩu"
					name="password"
					type="password"
					placeholder="Nhập mật khẩu"
					value={password}
					error={errors.password}
					onChange={handleChange}
				/>
				<Button className={clsx(styles["btn-primary"])} disabled={isSubmitting}>
					{isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
				</Button>
			</form>
			{isHaveRegister && (
				<div className={clsx(styles["actions-wrapper"])}>
					<Button className={clsx(styles["btn-forgot"])} size="no-padding">
						Quên mật khẩu
					</Button>
					<p className={clsx(styles["info"])}>Bạn chưa có tài khoản</p>
					<Button
						className={clsx(styles["btn-secondary"])}
						onClick={onOpenRegister}
						outline
					>
						Đăng ký
					</Button>
				</div>
			)}
		</Modal>
	);
};

export default LoginModal;
