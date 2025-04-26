import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import clsx from "clsx";

import styles from "./Room.module.scss";
import config from "@/config";
import { CinemaProps, SeatProps } from "@/types";
import { useSnackbar } from "@/context";
import * as Form from "@utils/validation";
import { cinemaService } from "@/services";
import { PageWrapper, Card, Input, Button, SeatLayout } from "@/components";

interface PreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	rows: number;
	columns: number;
	sweetboxRows: number;
}

type SeatType = "normal" | "vip" | "sweetbox";

const PreviewModal = ({
	isOpen,
	onClose,
	rows,
	columns,
	sweetboxRows,
}: PreviewModalProps) => {
	const generateSeats = () => {
		const seats: SeatProps[] = [];
		const hasSweetbox = sweetboxRows > 0;

		// Calculate VIP area
		const vipStartRow = Math.max(2, Math.floor(rows * 0.4));
		const vipEndRow = Math.min(rows - 1, Math.floor(rows * 0.7));

		// Calculate middle columns for VIP
		const midCol = columns % 2 === 0 ? columns / 2 : Math.ceil(columns / 2);
		const vipWidth = columns % 2 === 0 ? 6 : 5;
		const halfVip = Math.floor(vipWidth / 2);

		// VIP columns range
		const startCol = Math.max(
			1,
			midCol - halfVip + (columns % 2 === 0 ? 1 : 0)
		);
		const endCol = Math.min(columns, midCol + halfVip);

		// Sweetbox start row (từ cuối lên)
		const sweetboxStartRow = rows - sweetboxRows + 1;

		for (let row = 1; row <= rows; row++) {
			const rowLetter = String.fromCharCode(64 + row);

			for (let col = 1; col <= columns; col++) {
				let seatType: SeatType = "normal";
				let isSweetbox = false;

				if (hasSweetbox && row >= sweetboxStartRow) {
					seatType = "sweetbox";
					isSweetbox = true;
				} else if (
					row >= vipStartRow &&
					row <= vipEndRow &&
					col >= startCol &&
					col <= endCol
				) {
					seatType = "vip";
				}

				seats.push({
					id: (row - 1) * columns + col,
					room_id: 0,
					seat_code: `${rowLetter}${col}`,
					seat_type: seatType,
					is_sweetbox: isSweetbox,
				});
			}
		}
		return seats;
	};

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
			<DialogTitle>
				<div className="flex justify-between items-center">
					<span>Xem trước sơ đồ phòng chiếu</span>
					<div className={styles.legend}>
						<div className={styles["legend-item"]}>
							<div
								className={clsx(styles["legend-color"], styles.normal)}
							></div>
							<span>Ghế thường</span>
						</div>
						<div className={styles["legend-item"]}>
							<div className={clsx(styles["legend-color"], styles.vip)}></div>
							<span>Ghế VIP</span>
						</div>
						{sweetboxRows > 0 && (
							<div className={styles["legend-item"]}>
								<div
									className={clsx(styles["legend-color"], styles.sweetbox)}
								></div>
								<span>Ghế đôi</span>
							</div>
						)}
					</div>
				</div>
			</DialogTitle>
			<DialogContent>
				<SeatLayout seats={generateSeats()} isSweetBox={sweetboxRows > 0} />
			</DialogContent>
			<DialogActions>
				<Button outline onClick={onClose}>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export interface RoomFormData extends Form.FormValues {
	cinema_id: number;
	name: string;
	seat_rows: number | string;
	seat_columns: number | string;
	sweetbox_rows: number | string;
}

const validationRules: Form.ValidationRules = {
	name: {
		required: true,
		minLength: 3,
		maxLength: 255,
		message: "Tên phòng chiếu không được để trống",
	},
	seat_rows: {
		required: true,
		min: 1,
		max: 15,
		message: "Số hàng ghế không được để trống",
	},
	seat_columns: {
		required: true,
		min: 1,
		max: 15,
		message: "Số cột ghế không được để trống",
	},
	sweetbox_rows: {
		min: 0,
		max: 15,
	},
};

const RoomCreate = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { showSnackbar } = useSnackbar();
	const { cinema } = state as { cinema: CinemaProps };
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState<RoomFormData>({
		cinema_id: cinema.id,
		name: "",
		seat_rows: "",
		seat_columns: "",
		sweetbox_rows: "",
	});

	const validateRoomForm = (data: RoomFormData) => {
		const validationErrors = Form.validateForm(data, validationRules);

		if (
			Number(data.sweetbox_rows) &&
			Number(data.sweetbox_rows) >= Number(data.seat_rows)
		) {
			validationErrors.sweetbox_rows =
				"Số hàng sweetbox phải nhỏ hơn tổng số hàng";
		}

		return validationErrors;
	};

	const [showPreview, setShowPreview] = useState(false);
	const handlePreview = () => {
		const validationErrors = validateRoomForm(formData);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setShowPreview(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = validateRoomForm(formData);

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

			const response = await cinemaService.createRoom(
				cinema.id,
				formDataToSend
			);
			if (response.status == "success") {
				showSnackbar(response.message, "success");
				navigate(
					config.routes.admin_cinemas_detail.replace(
						":id",
						cinema.id.toString()
					)
				);
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

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

		if (errors[id]) {
			setErrors((prev) => ({
				...prev,
				[id]: "",
			}));
		}
	};

	return (
		<PageWrapper title={`Thêm phòng chiếu - ${cinema.name}`}>
			<Card title={`Thêm phòng chiếu`}>
				<form className={clsx(styles["form-wrapper"])} onSubmit={handleSubmit}>
					<input type="hidden" id="cinema_id" value={cinema.id} />
					<div className={clsx(styles["form-body"])}>
						<div className={clsx(styles["form-group"])}>
							<Input
								className="h-[43px]"
								label="Tên phòng chiếu"
								id="name"
								value={formData.name}
								placeholder="Nhập tên phòng chiếu"
								error={errors.name}
								onChange={handleChange}
							/>
							<Input
								className="h-[43px]"
								label="Rạp chiếu phim"
								id="cinema_name"
								value={cinema.name}
								readOnly
								disabled
							/>
						</div>

						<div className={clsx(styles["form-group"])}>
							<Input
								className="h-[43px]"
								type="number"
								min={1}
								max={15}
								label="Số hàng ghế"
								id="seat_rows"
								value={formData.seat_rows}
								placeholder="Nhập số hàng"
								error={errors.seat_rows}
								onChange={handleChange}
							/>
							<Input
								className="h-[43px]"
								type="number"
								min={1}
								max={15}
								label="Số cột ghế"
								id="seat_columns"
								value={formData.seat_columns}
								placeholder="Nhập số cột ghế"
								error={errors.seat_columns}
								onChange={handleChange}
							/>
							<Input
								className="h-[43px]"
								type="number"
								min={1}
								max={15}
								label="Số hàng sweetbox"
								id="sweetbox_rows"
								value={formData.sweetbox_rows}
								placeholder="Nhập số hàng sweetbox"
								error={errors.sweetbox_rows}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className={clsx(styles["actions-wrapper"])}>
						<Button outline to={config.routes.admin_cinemas}>
							Hủy
						</Button>
						<Button primary onClick={handlePreview} type="button">
							Xem trước
						</Button>
						<Button add type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang xử lý..." : "Thêm mới"}
						</Button>
					</div>
				</form>
			</Card>

			<PreviewModal
				isOpen={showPreview}
				onClose={() => setShowPreview(false)}
				rows={Number(formData.seat_rows) || 0}
				columns={Number(formData.seat_columns) || 0}
				sweetboxRows={Number(formData.sweetbox_rows) || 0}
			/>
		</PageWrapper>
	);
};

export default RoomCreate;
