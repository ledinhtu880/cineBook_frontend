import { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import styles from "./Cinema.module.scss";
import config from "@/config";
import { CityProps } from "@/types/";
import { useSnackbar } from "@/context";
import { cityService } from "@/services";
import * as Form from "@utils/validation";
import { Button, Input, Select, Skeleton } from "@/components";

export interface CinemaFormData extends Form.FormValues {
	name: string;
	address: string;
	city_id: number | string;
	phone: string;
}

interface CinemaFormProps {
	initialData?: CinemaFormData;
	mode: "create" | "edit";
	onSubmit: (formData: FormData) => Promise<void>;
}

const validationRules: Form.ValidationRules = {
	name: {
		required: true,
		minLength: 3,
		maxLength: 255,
		message: "Tên rạp không được để trống",
	},
	address: {
		required: true,
		minLength: 10,
		maxLength: 255,
		message: "Địa chỉ không được để trống",
	},
	city_id: {
		required: true,
		message: "Vui lòng chọn thành phố",
	},
	phone: {
		required: true,
		pattern: /^(?:\+84|0)([1-9])\d{8,9}$/,
		message: "Số điện thoại không hợp lệ (Ví dụ: 0865176605, +84865176605)",
	},
};

const CinemaForm: React.FC<CinemaFormProps> = ({
	initialData,
	mode,
	onSubmit,
}) => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [cities, setCities] = useState<CityProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<CinemaFormData>(
		initialData || {
			name: "",
			address: "",
			city_id: "",
			phone: "",
		}
	);

	useEffect(() => {
		(async () => {
			try {
				const response = await cityService.get();
				setCities(response);
			} catch (error) {
				console.error("Failed to fetch cities:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));

		// Clear error when user types
		if (errors[id]) {
			setErrors((prev) => ({
				...prev,
				[id]: "",
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = Form.validateForm(formData, validationRules);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			setIsSubmitting(true);
			const formDataToSend = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					formDataToSend.append(key, String(value));
				}
			});

			await onSubmit(formDataToSend);
			showSnackbar(
				`${mode === "create" ? "Tạo" : "Cập nhật"} rạp chiếu phim thành công`,
				"success"
			);
			navigate(config.routes.admin_cinemas);
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) return <Skeleton.CinemaSkeleton />;

	return (
		<form className={clsx(styles["form-wrapper"])} onSubmit={handleSubmit}>
			<div className={clsx(styles["form-body"])}>
				<Input
					className="h-[43px]"
					label="Tên rạp"
					id="name"
					value={formData.name}
					placeholder="Nhập tên rạp"
					error={errors.name}
					onChange={handleChange}
				/>
				<Input
					className="h-[43px]"
					label="Địa chỉ"
					id="address"
					value={formData.address}
					placeholder="Nhập địa chỉ"
					error={errors.address}
					onChange={handleChange}
				/>
				<Select
					className="h-[43px]"
					label="Thành phố"
					id="city_id"
					value={formData.city_id}
					error={errors.city_id}
					onChange={handleChange}
				>
					{cities.map((city) => (
						<option key={city.id} value={city.id}>
							{city.name}
						</option>
					))}
				</Select>
				<Input
					className="h-[43px]"
					label="Số điện thoại"
					id="phone"
					value={formData.phone}
					placeholder="Nhập số điện thoại"
					error={errors.phone}
					onChange={handleChange}
				/>
			</div>
			<div className={clsx(styles["actions-wrapper"])}>
				<Button outline to={config.routes.admin_cinemas}>
					Hủy
				</Button>
				<Button add type="submit" disabled={isSubmitting}>
					{isSubmitting
						? "Đang xử lý..."
						: mode === "create"
						? "Thêm mới"
						: "Cập nhật"}
				</Button>
			</div>
		</form>
	);
};

export default CinemaForm;
