import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./Booking.module.scss";
import {
	SeatProps,
	ShowtimeProps as Showtime,
	MovieProps as Movie,
} from "@/types";
import {
	Button,
	Container,
	CountdownTimer,
	Loading,
	SeatLayout,
	Tabs,
	Tooltip,
} from "@/components";

interface ShowtimeProps extends Showtime {
	cinema: {
		name: string;
	};
}

interface MovieProps extends Movie {
	showtimes: ShowtimeProps[];
}

interface GroupedSeat {
	id: string;
	display: string;
	type: "normal" | "vip" | "sweetbox";
	seats: SeatProps[];
}

const Booking = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [movie, setMovie] = useState<MovieProps>({} as MovieProps);
	const [loading, setLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedSeats, setSelectedSeats] = useState<SeatProps[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<string>("");
	const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeProps>(
		{} as ShowtimeProps
	);

	useEffect(() => {
		if (!location.state) {
			navigate("/", {
				state: {
					message: "Không tìm thấy thông tin đặt vé. Vui lòng thử lại.",
					severity: "error",
				},
			});
			return;
		}

		try {
			const { movieWithShowtime, showtimeWithCinema } = location.state;

			setSelectedShowtime(showtimeWithCinema);
			setMovie(movieWithShowtime);
		} catch (error) {
			console.error("Error when setting showtime:", error);
			alert(
				"Đã xảy ra lỗi khi lấy thông tin suất chiếu. Vui lòng thử lại sau."
			);
		} finally {
			setLoading(false);
		}
	}, [location.state, navigate]);

	const handleClickSeat = (seat: SeatProps) => {
		if (seat.is_sweetbox) {
			const seatNumber = parseInt(seat.seat_code.slice(1));
			const partnerSeatNumber =
				seatNumber % 2 === 0 ? seatNumber - 1 : seatNumber + 1;
			const partnerSeatCode = `${seat.seat_code.charAt(0)}${partnerSeatNumber}`;

			const partnerSeat = selectedShowtime.room.seats.find(
				(s: SeatProps) => s.seat_code === partnerSeatCode
			);

			if (partnerSeat) {
				const seatSelected = selectedSeats.some((s) => s.id === seat.id);
				const partnerSelected = selectedSeats.some(
					(s) => s.id === partnerSeat.id
				);

				if (seatSelected || partnerSelected) {
					setSelectedSeats(
						selectedSeats.filter(
							(s) => s.id !== seat.id && s.id !== partnerSeat.id
						)
					);
				} else {
					setSelectedSeats([...selectedSeats, seat, partnerSeat]);
				}
			}
		} else {
			// Xử lý cho ghế thường
			if (selectedSeats.some((s) => s.id === seat.id)) {
				setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
			} else {
				setSelectedSeats([...selectedSeats, seat]);
			}
		}
	};

	const handleShowtimeSelect = (showtime: ShowtimeProps) => {
		setSelectedShowtime(showtime);
		setSelectedSeats([]);
	};

	const handleNext = () => {
		if (canProceed() && currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

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

	const timeTabs = movie.showtimes?.map?.((showtime: ShowtimeProps) => {
		const showTime = {
			...showtime,
			cinema: {
				name: selectedShowtime.cinema.name,
			},
		};

		return {
			key: showtime.id,
			value: showTime,
			primary: showtime.start_time,
		};
	});

	const renderStepContent = () => {
		switch (currentStep) {
			case 0: {
				const sweetboxSeats = selectedShowtime.room.seats.filter(
					(s: SeatProps) => s.is_sweetbox
				).length;

				return (
					<>
						<h2 className={clsx(styles["step-title"], "border-left-accent")}>
							Đổi suất chiếu
						</h2>

						<Tabs
							items={timeTabs}
							selectedValue={selectedShowtime}
							onSelect={handleShowtimeSelect}
						/>
						<SeatLayout
							onClick={handleClickSeat}
							seats={selectedShowtime.room.seats}
							selectedSeats={selectedSeats}
							isSweetBox={sweetboxSeats > 0}
						/>
					</>
				);
			}
			case 1:
				return (
					<div className={clsx(styles["food-selection"])}>
						<h2 className={clsx(styles["section-title"])}>Chọn thức ăn</h2>
						<p className={clsx(styles["optional-note"])}>
							Bước này là tùy chọn, bạn có thể bỏ qua
						</p>
						<div className={clsx(styles["food-grid"])}>
							{[
								{ id: 1, name: "Bắp rang", price: 50000, image: "popcorn.jpg" },
								{ id: 2, name: "Coca Cola", price: 30000, image: "coke.jpg" },
								{ id: 3, name: "Combo 1", price: 120000, image: "combo1.jpg" },
							].map((food) => (
								<div key={food.id} className={clsx(styles["food-item"])}>
									<div className={clsx(styles["food-image"])}></div>
									<div className={clsx(styles["food-info"])}>
										<h3>{food.name}</h3>
										<p>
											{food.price.toLocaleString("it-IT", {
												style: "currency",
												currency: "VND",
											})}
										</p>
									</div>
									<div className={clsx(styles["food-quantity"])}></div>
								</div>
							))}
						</div>
					</div>
				);
			case 2: {
				const seatTotal = selectedSeats.length;
				const foodTotal = 100;
				const totalAmount = seatTotal + foodTotal;

				return (
					<div className={clsx(styles["payment"])}>
						<h2 className={clsx(styles["section-title"])}>Thanh toán</h2>

						<div className={clsx(styles["order-summary"])}>
							<h3>Tóm tắt đơn hàng</h3>
							<div className={clsx(styles["summary-item-total"], styles.total)}>
								<span>Tổng cộng:</span>
								<span>
									{totalAmount.toLocaleString("it-IT", {
										style: "currency",
										currency: "VND",
									})}
								</span>
							</div>
						</div>

						<div className={clsx(styles["payment-methods"])}>
							<h3>Phương thức thanh toán</h3>

							<div className={clsx(styles["payment-options"])}>
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
										<div className={clsx(styles["radio-button"])}></div>
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
					<div className={clsx(styles["confirmation"])}>
						<div className={clsx(styles["success-icon"])}>✓</div>
						<h2>Đặt vé thành công!</h2>
						<p>
							Mã đặt vé của bạn:
							<strong>BK{Math.floor(Math.random() * 10000)}</strong>
						</p>
						<p>Chúng tôi đã gửi thông tin đặt vé vào email của bạn.</p>
						<p>Vui lòng đến rạp trước giờ chiếu 15-30 phút để nhận vé.</p>

						<div className={clsx(styles["ticket-details"])}>
							<h3>Thông tin vé</h3>
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

	const renderBookingSummary = () => {
		const seatTotal = selectedSeats.reduce(
			(total, seat) => total + Number(seat.price),
			0
		);

		const groupedSeats: GroupedSeat[] = [];
		const sweetBoxPairs: Record<
			string,
			{ seats: SeatProps[]; display: string }
		> = {};

		selectedSeats.forEach((seat) => {
			if (seat.is_sweetbox) {
				const row = seat.seat_code.charAt(0);
				const seatNumber = parseInt(seat.seat_code.slice(1));
				const pairKey = `${row}${Math.ceil(seatNumber / 2)}`;

				if (!sweetBoxPairs[pairKey]) {
					sweetBoxPairs[pairKey] = {
						seats: [seat],
						display: "",
					};
				} else {
					sweetBoxPairs[pairKey].seats.push(seat);
					const sortedSeats = sweetBoxPairs[pairKey].seats.sort((a, b) => {
						return (
							parseInt(a.seat_code.slice(1)) - parseInt(b.seat_code.slice(1))
						);
					});

					const firstSeat = sortedSeats[0];
					const secondSeat = sortedSeats[1];
					sweetBoxPairs[pairKey].display = `${firstSeat.seat_code.charAt(
						0
					)}${parseInt(firstSeat.seat_code.slice(1))}-${parseInt(
						secondSeat.seat_code.slice(1)
					)}`;

					groupedSeats.push({
						id: `${firstSeat.id}-${secondSeat.id}`,
						display: sweetBoxPairs[pairKey].display,
						type: seat.seat_type,
						seats: sortedSeats,
					});
				}
			} else {
				groupedSeats.push({
					id: String(seat.id),
					display: seat.seat_code,
					type: seat.seat_type,
					seats: [seat],
				});
			}
		});

		return (
			<div className={clsx(styles["summary-card"])}>
				<h3 className={clsx(styles["summary-title"])}>
					Thông tin đặt vé
					<CountdownTimer
						initialTime={4200}
						onTimeEnd={() => {
							navigate("/", {
								state: {
									message: "Hết thời gian đặt vé, vui lòng thử lại.",
									severity: "warning",
								},
							});
						}}
					/>
				</h3>

				<div className={clsx(styles["summary-info"])}>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Phim:&nbsp;
						</span>
						{movie.title}
					</p>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Suất chiếu:&nbsp;
						</span>
						{selectedShowtime.start_time}
					</p>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Rạp:&nbsp;
						</span>
						{selectedShowtime.cinema.name}
					</p>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Phòng:&nbsp;
						</span>
						{selectedShowtime.room.name}
					</p>
				</div>

				<div className={clsx(styles["summary-seats"])}>
					<h4 className={clsx(styles["summary-seats-title"])}>
						Ghế đã chọn ({groupedSeats.length})
					</h4>

					{groupedSeats.length > 0 ? (
						<>
							<ul className={clsx(styles["summary-seats-list"])}>
								{groupedSeats.map((groupedSeat) => (
									<li
										key={groupedSeat.id}
										className={clsx(styles["summary-seats-item"], {
											[styles[groupedSeat.type]]: groupedSeat.type,
										})}
									>
										{groupedSeat.display}
										<Tooltip
											title={`Xóa ghế ${groupedSeat.display}`}
											arrow
											placement="bottom"
										>
											<button
												className={clsx(styles["remove-button"])}
												onClick={() => {
													groupedSeat.seats.forEach((seat) =>
														handleClickSeat(seat)
													);
												}}
											>
												&times;
											</button>
										</Tooltip>
									</li>
								))}
							</ul>

							<ul className={clsx(styles["summary-prices-list"])}>
								{/* Normal seats */}
								{selectedSeats.some((seat) => seat.seat_type === "normal") && (
									<li className={clsx(styles["summary-prices-item"])}>
										<span>
											Ghế thường (
											{
												groupedSeats.filter((group) =>
													group.seats.some(
														(seat) => seat.seat_type === "normal"
													)
												).length
											}
											):
										</span>
										<span>
											{selectedSeats
												.filter((seat) => seat.seat_type === "normal")
												.reduce((acc, seat) => acc + Number(seat.price), 0)
												.toLocaleString("it-IT", {
													style: "currency",
													currency: "VND",
												})}
										</span>
									</li>
								)}

								{/* VIP seats */}
								{selectedSeats.some((seat) => seat.seat_type === "vip") && (
									<li className={clsx(styles["summary-prices-item"])}>
										<span>
											Ghế VIP (
											{
												groupedSeats.filter((group) =>
													group.seats.some((seat) => seat.seat_type === "vip")
												).length
											}
											):
										</span>
										<span>
											{selectedSeats
												.filter((seat) => seat.seat_type === "vip")
												.reduce((acc, seat) => acc + Number(seat.price), 0)
												.toLocaleString("it-IT", {
													style: "currency",
													currency: "VND",
												})}
										</span>
									</li>
								)}

								{/* Sweetbox seats */}
								{groupedSeats.some((group) => group.type === "sweetbox") && (
									<li className={clsx(styles["summary-prices-item"])}>
										<span>
											Ghế đôi (
											{
												groupedSeats.filter(
													(group) => group.type === "sweetbox"
												).length
											}
											):
										</span>
										<span>
											{selectedSeats
												.filter((seat) => seat.seat_type === "sweetbox")
												.reduce((acc, seat) => acc + Number(seat.price), 0)
												.toLocaleString("it-IT", {
													style: "currency",
													currency: "VND",
												})}
										</span>
									</li>
								)}

								<div className={clsx(styles["summary-prices-total"])}>
									<span>Tổng tiền:</span>
									<span>
										{seatTotal.toLocaleString("it-IT", {
											style: "currency",
											currency: "VND",
										})}
									</span>
								</div>
							</ul>
						</>
					) : (
						<p className={clsx(styles["empty"])}>Chưa có ghế nào được chọn</p>
					)}
				</div>

				{/* Action buttons */}
				<div className={clsx(styles["navigation-buttons"])}>
					{currentStep > 0 && currentStep < 3 && (
						<Button
							className={clsx(styles["back-button"])}
							onClick={handleBack}
						>
							Quay lại
						</Button>
					)}

					{currentStep < 3 ? (
						<Button
							className={clsx(styles["next-button"])}
							onClick={handleNext}
							disabled={!canProceed()}
							primary
						>
							{currentStep === 2 ? "Xác nhận đặt vé" : "Tiếp tục"}
						</Button>
					) : (
						<Button className={clsx(styles["finish-button"])} to="/" primary>
							Về trang chủ
						</Button>
					)}
				</div>
			</div>
		);
	};

	if (loading) return <Loading absolute />;

	return (
		<Container className={clsx(styles["heading"])}>
			<h1 className={clsx(styles["title"])}>
				{currentStep === 3 ? "Hoàn tất đặt vé" : "Đặt vé - " + movie.title}
			</h1>
			<div className={clsx(styles["heading-container"])}>
				{steps.map((step, index) => (
					<div
						key={step.id}
						className={clsx(styles["heading-item"], {
							[styles.completed]: step.status === "completed",
							[styles.current]: step.status === "current",
							[styles.pending]: step.status === "pending",
						})}
					>
						<div className={clsx(styles["heading-number"])}>{index + 1}</div>
						<div className={clsx(styles["heading-name"])}>{step.name}</div>
						{index < steps.length - 1 && (
							<div className={clsx(styles["heading-connector"])}></div>
						)}
					</div>
				))}
			</div>
			<div className={clsx(styles["content"])}>
				<div className={clsx(styles["step-container"])}>
					{renderStepContent()}
				</div>

				{currentStep < 3 && (
					<div className={clsx(styles["summary-container"])}>
						{renderBookingSummary()}
					</div>
				)}
			</div>
		</Container>
	);
};

export default Booking;
