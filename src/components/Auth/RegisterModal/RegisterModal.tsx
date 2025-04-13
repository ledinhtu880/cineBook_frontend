import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "../Auth.module.scss";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Image from "@/components/Image";
import {
	ValidationErrors,
	ApiError,
	RegisterFormData,
	CityProps,
} from "@/types";
import { validateRegisterForm } from "@/utils/authValidation";
import { authService, cityService } from "@/services/";

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
		phone: "",
		city_id: 0,
		password: "",
		password_confirmation: "",
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [cities, setCities] = useState<CityProps[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		try {
			const fetchCities = async () => {
				const data = await cityService.get();
				setCities(data);
			};
			fetchCities();
		} catch (error) {
			console.error("Failed to fetch cities:", error);
			alert("Có lỗi xảy ra khi tải danh sách thành phố. Vui lòng thử lại sau.");
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = validateRegisterForm(formData);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			setIsSubmitting(true);
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
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} width={600} height={800}>
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
				<div className={clsx(styles["form-group"])}>
					<Input
						label="Họ"
						id="last_name"
						name="last_name"
						value={formData.last_name}
						error={errors.last_name}
						placeholder="Nhập họ"
						onChange={handleChange}
					/>
					<Input
						label="Tên"
						id="first_name"
						name="first_name"
						value={formData.first_name}
						error={errors.first_name}
						placeholder="Nhập tên"
						onChange={handleChange}
					/>
				</div>
				<div className={clsx(styles["form-group"])}>
					<Input
						label="Email"
						id="email"
						name="email"
						placeholder="Nhập email"
						error={errors.email}
						onChange={handleChange}
					/>
					<Input
						label="Số điện thoại"
						id="phone"
						name="phone"
						placeholder="Nhập số điện thoại"
						error={errors.phone}
						onChange={handleChange}
					/>
				</div>
				<Select
					label="Thành phố"
					id="city_id"
					name="city_id"
					error={errors.city_id}
					onChange={handleChange}
				>
					<option value="" disabled>
						Chọn thành phố
					</option>
					{cities.map((city) => (
						<option key={city.id} value={city.id}>
							{city.name}
						</option>
					))}
				</Select>
				<Input
					label="Mật khẩu"
					id="password"
					name="password"
					type="password"
					placeholder="Nhập mật khẩu"
					error={errors.password}
					onChange={handleChange}
				/>
				<Input
					label="Mật khẩu"
					id="password_confirmation"
					name="password_confirmation"
					type="password"
					placeholder="Nhập lại mật khẩu"
					error={errors.password_confirmation}
					onChange={handleChange}
				/>
				<Button className={clsx(styles["btn-primary"])} disabled={isSubmitting}>
					{isSubmitting ? "Đang xử lý..." : "Đăng ký"}
				</Button>
			</form>
			<div className={clsx(styles["actions-wrapper"])}>
				<p className={clsx(styles["info"])}>Bạn đã có tài khoản?</p>
				<Button
					className={clsx(styles["btn-secondary"])}
					outline
					onClick={onOpenLogin}
				>
					Đăng nhập
				</Button>
			</div>
		</Modal>
	);
};

export default RegisterModal;
