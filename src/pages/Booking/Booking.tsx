import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import clsx from "clsx";

import styles from "./Booking.module.scss";
import { movieService } from "@/services";
import { MovieProps } from "@/types";
import { Container, Loading, Button } from "@/components";

const Booking = () => {
	const { state } = useLocation();
	const { slug } = useParams();
	const { showtime } = state;

	const [movie, setMovie] = useState<MovieProps>({} as MovieProps);
	const [loading, setLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);

	// Thêm các state để lưu thông tin trong quá trình đặt vé
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<string>("");

	// Kiểm tra xem có thể chuyển sang bước tiếp theo không
	const canProceed = () => {
		switch (currentStep) {
			case 0:
				return selectedSeats.length > 0;
			case 1:
				return true;
			case 2:
				return !!paymentMethod;
			default:
				return false;
		}
	};

	const steps = [
		{
			id: 0,
			name: "Chọn ghế",
			status:
				currentStep > 0
					? "completed"
					: currentStep === 0
					? "current"
					: "pending",
		},
		{
			id: 1,
			name: "Chọn thức ăn",
			status:
				currentStep > 1
					? "completed"
					: currentStep === 1
					? "current"
					: "pending",
		},
		{
			id: 2,
			name: "Thanh toán",
			status:
				currentStep > 2
					? "completed"
					: currentStep === 2
					? "current"
					: "pending",
		},
		{
			id: 3,
			name: "Xác nhận",
			status: currentStep === 3 ? "current" : "pending",
		},
	];

	// Xử lý khi người dùng nhấn nút Tiếp tục
	const handleNext = () => {
		if (canProceed() && currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	// Xử lý khi người dùng nhấn nút Quay lại
	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Hiển thị nội dung theo bước hiện tại
	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<div className={styles["seat-selection"]}>
						<h2 className={styles["section-title"]}>Chọn ghế</h2>
						<p className={styles["showtime-info"]}>
							Phim: {movie.title} <br />
							Thời gian: {new Date(showtime.start_time).toLocaleString()} <br />
							Phòng: {showtime.room}
						</p>
						<div className={styles["seat-grid"]}>
							{["A1", "A2", "A3", "B1", "B2", "B3"].map((seat) => (
								<div
									key={seat}
									className={clsx(styles.seat, {
										[styles.selected]: selectedSeats.includes(seat),
									})}
									onClick={() => {
										if (selectedSeats.includes(seat)) {
											setSelectedSeats(selectedSeats.filter((s) => s !== seat));
										} else {
											setSelectedSeats([...selectedSeats, seat]);
										}
									}}
								>
									{seat}
								</div>
							))}
						</div>
						<div className={styles["seat-legend"]}>
							<div className={styles["legend-item"]}>
								<div className={styles["sample-seat"]}></div>
								<span>Ghế trống</span>
							</div>
							<div className={styles["legend-item"]}>
								<div
									className={clsx(styles["sample-seat"], styles.selected)}
								></div>
								<span>Ghế đã chọn</span>
							</div>
							<div className={styles["legend-item"]}>
								<div
									className={clsx(styles["sample-seat"], styles.occupied)}
								></div>
								<span>Ghế đã đặt</span>
							</div>
						</div>
						{selectedSeats.length > 0 && (
							<div className={styles["selection-summary"]}>
								<p>
									Đã chọn {selectedSeats.length} ghế: {selectedSeats.join(", ")}
								</p>
								<p>Tổng tiền: {selectedSeats.length * 90000} VND</p>
							</div>
						)}
					</div>
				);
			case 1:
				return (
					<div className={styles["food-selection"]}>
						<h2 className={styles["section-title"]}>Chọn thức ăn</h2>
						<p className={styles["optional-note"]}>
							Bước này là tùy chọn, bạn có thể bỏ qua
						</p>
						<div className={styles["food-grid"]}>
							{[
								{ id: 1, name: "Bắp rang", price: 50000, image: "popcorn.jpg" },
								{ id: 2, name: "Coca Cola", price: 30000, image: "coke.jpg" },
								{ id: 3, name: "Combo 1", price: 120000, image: "combo1.jpg" },
							].map((food) => (
								<div key={food.id} className={styles["food-item"]}>
									<div className={styles["food-image"]}></div>
									<div className={styles["food-info"]}>
										<h3>{food.name}</h3>
										<p>{food.price.toLocaleString()} VND</p>
									</div>
									<div className={styles["food-quantity"]}></div>
								</div>
							))}
						</div>
					</div>
				);
			case 2: {
				const seatTotal = selectedSeats.length * 90000;
				const foodTotal = 100;
				const totalAmount = seatTotal + foodTotal;

				return (
					<div className={styles["payment"]}>
						<h2 className={styles["section-title"]}>Thanh toán</h2>

						<div className={styles["order-summary"]}>
							<h3>Tóm tắt đơn hàng</h3>
							<div className={styles["summary-item"]}>
								<span>Phim:</span>
								<span>{movie.title}</span>
							</div>
							<div className={styles["summary-item"]}>
								<span>Suất chiếu:</span>
								<span>{new Date(showtime.start_time).toLocaleString()}</span>
							</div>
							<div className={styles["summary-item"]}>
								<span>Ghế:</span>
								<span>{selectedSeats.join(", ")}</span>
							</div>
							<div className={styles["summary-item"]}>
								<span>Tiền ghế:</span>
								<span>{seatTotal.toLocaleString()} VND</span>
							</div>

							<div className={clsx(styles["summary-item"], styles.total)}>
								<span>Tổng cộng:</span>
								<span>{totalAmount.toLocaleString()} VND</span>
							</div>
						</div>

						<div className={styles["payment-methods"]}>
							<h3>Phương thức thanh toán</h3>

							<div className={styles["payment-options"]}>
								{[
									"Thẻ tín dụng/ghi nợ",
									"Chuyển khoản ngân hàng",
									"Ví điện tử",
									"Tiền mặt",
								].map((method) => (
									<div
										key={method}
										className={clsx(styles["payment-option"], {
											[styles.selected]: paymentMethod === method,
										})}
										onClick={() => setPaymentMethod(method)}
									>
										<div className={styles["radio-button"]}></div>
										<span>{method}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				);
			}
			case 3:
				return (
					<div className={styles["confirmation"]}>
						<div className={styles["success-icon"]}>✓</div>
						<h2>Đặt vé thành công!</h2>
						<p>
							Mã đặt vé của bạn:{" "}
							<strong>BK{Math.floor(Math.random() * 10000)}</strong>
						</p>
						<p>Chúng tôi đã gửi thông tin đặt vé vào email của bạn.</p>
						<p>Vui lòng đến rạp trước giờ chiếu 15-30 phút để nhận vé.</p>

						<div className={styles["ticket-details"]}>
							<h3>Thông tin vé</h3>
							<p>
								<strong>Phim:</strong> {movie.title}
							</p>
							<p>
								<strong>Rạp:</strong> {showtime.room}
							</p>
							<p>
								<strong>Ngày chiếu:</strong>{" "}
								{new Date(showtime.start_time).toLocaleDateString()}
							</p>
							<p>
								<strong>Giờ chiếu:</strong>{" "}
								{new Date(showtime.start_time).toLocaleTimeString()}
							</p>
							<p>
								<strong>Ghế:</strong> {selectedSeats.join(", ")}
							</p>
							<p>
								<strong>Phương thức thanh toán:</strong> {paymentMethod}
							</p>
						</div>
					</div>
				);
			default:
				return <div>Bước không hợp lệ</div>;
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getMovieBySlug(slug as string);
				setMovie(response);
			} catch (error) {
				console.error("Error fetching movie data:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, [slug]);

	if (loading) return <Loading absolute />;

	return (
		<Container className="py-3">
			{/* Tiêu đề */}
			<h1 className={styles["booking-title"]}>
				{currentStep === 3 ? "Hoàn tất đặt vé" : "Đặt vé - " + movie.title}
			</h1>

			{/* Hiển thị các bước */}
			<div className={styles["steps-container"]}>
				{steps.map((step, index) => (
					<div
						key={step.id}
						className={clsx(styles["step-item"], {
							[styles.completed]: step.status === "completed",
							[styles.current]: step.status === "current",
							[styles.pending]: step.status === "pending",
						})}
					>
						<div className={styles["step-number"]}>{index + 1}</div>
						<div className={styles["step-name"]}>{step.name}</div>
						{index < steps.length - 1 && (
							<div className={styles["step-connector"]}></div>
						)}
					</div>
				))}
			</div>

			<div className={styles["step-content"]}>{renderStepContent()}</div>

			<div className={styles["navigation-buttons"]}>
				{currentStep > 0 && currentStep < 3 && (
					<Button className={styles["back-button"]} onClick={handleBack}>
						Quay lại
					</Button>
				)}

				{currentStep < 3 ? (
					<Button
						className={styles["next-button"]}
						onClick={handleNext}
						disabled={!canProceed()}
						primary
					>
						{currentStep === 2 ? "Xác nhận đặt vé" : "Tiếp tục"}
					</Button>
				) : (
					<Button className={styles["finish-button"]} to="/" primary>
						Về trang chủ
					</Button>
				)}
			</div>
		</Container>
	);
};

export default Booking;
