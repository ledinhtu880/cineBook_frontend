import { useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import styles from "./Movie.module.scss";
import config from "@/config";
import { useSnackbar } from "@/context";
import * as Form from "@utils/validation";
import type { ValidationErrors, ApiError } from "@/types";
import { TextArea, Select, Button, Input, Image } from "@/components";

export interface MovieFormData extends Form.FormValues {
	title: string;
	description: string;
	release_date: string;
	duration: number;
	age_rating: string;
	trailer_url: string;
	poster_url: File | null | string;
}

interface MovieFormProps {
	initialData?: MovieFormData;
	mode: "create" | "edit";
	onSubmit: (formData: FormData) => Promise<void>;
}

const ageRatingOptions = [
	{ value: "P", label: "P - Phổ biến" },
	{ value: "K", label: "K - Khuyến cáo" },
	{ value: "T13", label: "T13 - Từ 13 tuổi" },
	{ value: "T16", label: "T16 - Từ 16 tuổi" },
	{ value: "T18", label: "T18 - Từ 18 tuổi" },
];

const validationRules: Form.ValidationRules = {
	title: {
		required: true,
		minLength: 2,
		message: "Tên phim không được để trống",
	},
	description: {
		required: true,
		minLength: 10,
		message: "Mô tả phải có ít nhất 10 ký tự",
	},
	duration: {
		required: true,
		min: 30,
		max: 300,
		message: "Thời lượng phải từ 30 đến 300 phút",
	},
	release_date: {
		required: true,
		message: "Vui lòng chọn ngày khởi chiếu",
	},
	trailer_url: {
		required: true,
		trailer_url: true,
		message: "URL trailer không hợp lệ",
	},
};

const MovieForm = ({ initialData, mode, onSubmit }: MovieFormProps) => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [posterPreview, setPosterPreview] = useState<string>(() => {
		// Nếu là edit mode, sử dụng URL từ API
		if (mode === "edit" && typeof initialData?.poster_url === "string") {
			return initialData.poster_url;
		}
		return "";
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState<MovieFormData>(() => {
		if (initialData) {
			return {
				...initialData,
				// Reset poster_url về null nếu là URL từ API
				poster_url:
					typeof initialData.poster_url === "string"
						? null
						: initialData.poster_url,
			};
		}
		return {
			title: "",
			description: "",
			release_date: "",
			duration: 0,
			age_rating: "P",
			trailer_url: "",
			poster_url: null,
		};
	});

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
				if (key === "poster_url") {
					if (formData.poster_url instanceof File) {
						formDataToSend.append("poster_url", formData.poster_url);
					} else if (
						typeof formData.poster_url === "string" &&
						mode === "edit"
					) {
						formDataToSend.append("keep_existing_poster", "true");
					}
				} else if (value !== null && value !== undefined) {
					formDataToSend.append(key, String(value));
				}
			});

			await onSubmit(formDataToSend);
			showSnackbar(
				`${mode === "create" ? "Thêm" : "Cập nhật"} phim thành công`,
				"success"
			);
			navigate(config.routes.admin_movies);
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
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPosterPreview(URL.createObjectURL(file));
			setFormData((prev) => ({
				...prev,
				poster_url: file,
			}));
		}
	};

	return (
		<form className={clsx(styles["wrapper"])} onSubmit={handleSubmit}>
			{/* Left side - Poster preview */}
			{posterPreview ? (
				<Image
					src={posterPreview}
					alt="Poster preview"
					className={clsx(styles["image"])}
				/>
			) : (
				<div className={clsx(styles["image-placeholder"])}>
					<span className={clsx(styles["image-placeholder-text"])}>
						Chưa có poster
					</span>
				</div>
			)}

			{/* Right side - Movie information form */}
			<div className={clsx(styles["right-section-wrapper"])}>
				<div className={clsx(styles["right-section"])}>
					<Input
						className="h-[43px]"
						label="Tên phim"
						id="title"
						value={formData.title}
						placeholder="Nhập tên phim"
						error={errors.title}
						onChange={handleChange}
					/>

					<Input
						className="h-[43px]"
						type="number"
						label="Thời lượng (phút)"
						id="duration"
						value={formData.duration}
						placeholder="Nhập thời lượng phim"
						error={errors.duration}
						onChange={handleChange}
					/>

					<Input
						className="h-[43px]"
						label="Ngày khởi chiếu"
						id="release_date"
						name="poster_url"
						value={formData.release_date}
						type="date"
						error={errors.release_date}
						onChange={handleChange}
					/>

					<Select
						className="h-[43px]"
						label="Giới hạn độ tuổi"
						id="age_rating"
						value={formData.age_rating}
						error={errors.age_rating}
						onChange={handleChange}
					>
						{ageRatingOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>

					<Input
						className="h-[43px]"
						label="URL Trailer"
						id="trailer_url"
						value={formData.trailer_url}
						error={errors.trailer_url}
						placeholder="Nhập trailer phim"
						onChange={handleChange}
					/>

					<Input
						className="h-[43px]"
						label="Chọn file"
						id="poster_url"
						type="file"
						accept="image/*"
						error={errors.poster_url}
						onChange={handleFileChange}
					/>

					<div className="col-span-2">
						<TextArea
							className="h-[80px]"
							label="Mô tả"
							id="description"
							error={errors.description}
							defaultValue={formData.description}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className={clsx(styles["actions-wrapper"])}>
					<Button outline to={config.routes.admin_movies}>
						Hủy
					</Button>
					<Button add type="submit" disabled={isSubmitting}>
						{isSubmitting
							? "Đang xử lý..."
							: mode === "create"
							? "Thêm phim"
							: "Cập nhật phim"}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default MovieForm;
