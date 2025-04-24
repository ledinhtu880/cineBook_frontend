import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./Booking.module.scss";
import {
	SeatProps,
	ShowtimeProps as ShowtimeProps,
	MovieProps as Movie,
} from "@/types";
import { productComboService } from "@/services";
import { numberFormat } from "@/utils";
import {
	Button,
	Container,
	CountdownTimer,
	Loading,
	Image,
	SeatLayout,
	Tabs,
	Tooltip,
} from "@/components";

interface ComboProps {
	id: number;
	name: string;
	description: string;
	price: number;
	price_label: string;
	image_url: string;
}

interface SelectedProductProps extends ComboProps {
	quantity: number;
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

	const [loading, setLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);

	const [movie, setMovie] = useState<MovieProps>({} as MovieProps);
	const [cinemaName, setCinemaName] = useState<string>("");
	const [combos, setCombos] = useState<ComboProps[]>([]);
	const [showtimes, setShowtimes] = useState<ShowtimeProps[]>([]);

	const [termsAccepted, setTermsAccepted] = useState(false);
	const [selectedSeats, setSelectedSeats] = useState<SeatProps[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<
		SelectedProductProps[]
	>([]);
	const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeProps>(
		{} as ShowtimeProps
	);
	const [paymentMethod, setPaymentMethod] = useState<string>("");

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
			const { movieInfo, selectedShowtime, listShowtimes, cinemaName } =
				location.state;

			setSelectedShowtime(selectedShowtime);
			setShowtimes(listShowtimes);
			setCinemaName(cinemaName);
			setMovie(movieInfo);
			document.title = "Đặt vé  " + movieInfo.title;
		} catch (error) {
			console.error("Error when setting showtime:", error);
			navigate("/", {
				state: {
					message:
						"Đã xảy ra lỗi khi lấy thông tin suất chiếu. Vui lòng thử lại sau.",
					severity: "error",
				},
			});
		} finally {
			setLoading(false);
		}
	}, [location.state, navigate]);

	useEffect(() => {
		(async () => {
			try {
				const response = await productComboService.get();
				setCombos(response);
			} catch (error) {
				console.error("Error fetching combos:", error);
			}
		})();
	}, []);

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

	const handleIncreaseQuantity = (product: ComboProps) => {
		setSelectedProducts((prev) => {
			const existingProductIndex = prev.findIndex(
				(item) => item.id === product.id
			);

			if (existingProductIndex >= 0) {
				const newProducts = [...prev];
				newProducts[existingProductIndex] = {
					...newProducts[existingProductIndex],
					quantity: newProducts[existingProductIndex].quantity + 1,
				};

				return newProducts;
			} else {
				return [...prev, { ...product, quantity: 1 }];
			}
		});
	};

	const handleDecreaseQuantity = (product: ComboProps) => {
		setSelectedProducts((prev) => {
			const existingProductIndex = prev.findIndex(
				(item) => item.id === product.id
			);

			if (existingProductIndex >= 0) {
				const currentQuantity = prev[existingProductIndex].quantity;

				if (currentQuantity > 1) {
					const newProducts = [...prev];
					newProducts[existingProductIndex] = {
						...newProducts[existingProductIndex],
						quantity: currentQuantity - 1,
					};
					return newProducts;
				} else {
					return prev.filter((_, index) => index !== existingProductIndex);
				}
			}

			return prev;
		});
	};

	const getProductQuantity = (productId: number) => {
		const product = selectedProducts.find((item) => item.id === productId);
		return product ? product.quantity : 0;
	};

	const getTotal = () => {
		const seatTotal = selectedSeats.reduce(
			(total, seat) => total + Number(seat.price),
			0
		);
		const foodTotal = selectedProducts.reduce(
			(total, product) => total + product.price * product.quantity,
			0
		);
		return seatTotal + foodTotal;
	};

	const canProceed = () => {
		switch (currentStep) {
			case 0:
				return selectedSeats.length > 0;
			case 1:
				return true;
			case 2:
				return !!paymentMethod && termsAccepted;
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

	const timeTabs = showtimes.map?.((showtime: ShowtimeProps) => {
		const showTime = {
			...showtime,
		};

		return {
			key: showtime.id,
			value: showTime,
			primary: showtime.start_time_formatted,
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

						<div className={clsx(styles["date-tabs"])}>
							<Tabs
								items={timeTabs}
								selectedValue={selectedShowtime}
								onSelect={handleShowtimeSelect}
								small
							/>
						</div>
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
					<>
						<h2 className={clsx(styles["step-title"], "border-left-accent")}>
							Chọn đồ ăn
						</h2>
						<p className={clsx(styles["step-note"])}>
							Bước này là tùy chọn, bạn có thể bỏ qua
						</p>
						<div className={clsx(styles["products-list"])}>
							{combos.map((product) => (
								<div key={product.id} className={clsx(styles["products-item"])}>
									<Image
										src={product.image_url}
										alt={product.name}
										className={clsx(styles["products-image"])}
									/>
									<div className={clsx(styles["products-info"])}>
										<div className={clsx(styles["products-detail"])}>
											<h3 className={clsx(styles["products-name"])}>
												{product.name}
											</h3>
											<p className={clsx(styles["products-description"])}>
												{product.description}
											</p>
											<p className={clsx(styles["products-price"])}>
												Giá: {product.price_label}
											</p>
										</div>
									</div>
									<div className={clsx(styles["products-quantity"])}>
										<button
											className={clsx(styles["quantity-btn"])}
											onClick={() => handleDecreaseQuantity(product)}
											disabled={getProductQuantity(product.id) === 0}
										>
											-
										</button>
										<span className={clsx(styles["quantity-value"])}>
											{getProductQuantity(product.id)}
										</span>
										<button
											className={clsx(styles["quantity-btn"])}
											onClick={() => handleIncreaseQuantity(product)}
										>
											+
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				);
			case 2: {
				return (
					<div className={clsx(styles["payment"])}>
						<h2 className={clsx(styles["step-title"], "border-left-accent")}>
							Phương thức thanh toán
						</h2>

						<div className={clsx(styles["payment-methods"])}>
							<div className={clsx(styles["payment-options"])}>
								{[
									{
										id: "bank_transfer",
										name: "Chuyển khoản ngân hàng",
										description:
											"Chuyển khoản qua tài khoản ngân hàng của chúng tôi",
										icon: "bank-icon.svg",
									},
									{
										id: "e_wallet",
										name: "Ví điện tử",
										description:
											"Thanh toán qua ví điện tử như MoMo, ZaloPay, VNPay",
										icon: "wallet-icon.svg",
									},
									{
										id: "cash",
										name: "Tiền mặt",
										description: "Đặt chỗ trước và thanh toán tại quầy",
										icon: "cash-icon.svg",
									},
								].map((method) => (
									<div
										key={method.id}
										className={clsx(styles["payment-option"], {
											[styles.selected]: paymentMethod === method.name,
										})}
										onClick={() => setPaymentMethod(method.name)}
									>
										<div className={clsx(styles["payment-option-header"])}>
											<div className={clsx(styles["radio-button"])}></div>
											<span className={clsx(styles["payment-name"])}>
												{method.name}
											</span>
										</div>
										<p className={clsx(styles["payment-description"])}>
											{method.description}
										</p>

										{/* Hiển thị chi tiết khi phương thức được chọn */}
										{paymentMethod === method.name && (
											<div className={clsx(styles["payment-details"])}>
												{method.id === "bank_transfer" && (
													<div className={clsx(styles["bank-details"])}>
														<p className={clsx(styles["payment-instruction"])}>
															Vui lòng chuyển khoản với nội dung:{" "}
															<strong>
																BK{Math.floor(Math.random() * 10000)}
															</strong>
														</p>
														<table className={clsx(styles["bank-info"])}>
															<tbody>
																<tr>
																	<td>Ngân hàng:</td>
																	<td>
																		<strong>Vietcombank</strong>
																	</td>
																</tr>
																<tr>
																	<td>Số tài khoản:</td>
																	<td>
																		<strong>1234567890</strong>
																	</td>
																</tr>
																<tr>
																	<td>Chủ tài khoản:</td>
																	<td>
																		<strong>CÔNG TY TNHH RẠP CHIẾU PHIM</strong>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												)}

												{method.id === "e_wallet" && (
													<div className={clsx(styles["wallet-options"])}>
														<p className={clsx(styles["payment-instruction"])}>
															Chọn ví điện tử bạn muốn sử dụng:
														</p>
														<div className={clsx(styles["wallet-list"])}>
															{["MoMo", "ZaloPay", "VNPay"].map((wallet) => (
																<button
																	key={wallet}
																	className={clsx(styles["wallet-button"])}
																	onClick={() => {
																		// Handle wallet selection
																		console.log(`Selected ${wallet}`);
																	}}
																>
																	{wallet}
																</button>
															))}
														</div>
													</div>
												)}

												{method.id === "cash" && (
													<div className={clsx(styles["cash-details"])}>
														<p className={clsx(styles["payment-instruction"])}>
															Vé của bạn sẽ được giữ trong vòng 30 phút. Vui
															lòng đến quầy vé trước suất chiếu ít nhất 30 phút
															để thanh toán và nhận vé.
														</p>
														<div className={clsx(styles["cash-warning"])}>
															<span className={clsx(styles["warning-icon"])}>
																⚠️
															</span>
															<p>
																Lưu ý: Vé sẽ tự động hủy nếu bạn không đến đúng
																giờ.
															</p>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Nếu đã chọn phương thức, hiển thị điều khoản và điều kiện */}
						{paymentMethod && (
							<div className={clsx(styles["terms-section"])}>
								<div className={clsx(styles["terms-checkbox"])}>
									<input
										type="checkbox"
										id="accept-terms"
										checked={termsAccepted}
										onChange={(e) => setTermsAccepted(e.target.checked)}
									/>
									<label htmlFor="accept-terms">
										Tôi đồng ý với{" "}
										<a href="#" className={clsx(styles["terms-link"])}>
											điều khoản và điều kiện
										</a>
									</label>
								</div>
							</div>
						)}
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
						{selectedShowtime.start_time_formatted} - {selectedShowtime.date}
					</p>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Rạp:&nbsp;
						</span>
						{cinemaName}
					</p>
					<p className={clsx(styles["summary-item"])}>
						<span className={clsx(styles["summary-item-label"])}>
							Phòng:&nbsp;
						</span>
						{selectedShowtime.room.name}
					</p>
				</div>

				<div className={clsx(styles["summary-seats"])}>
					<h4 className={clsx(styles["summary-seats-title"])}>Ghế đã chọn</h4>

					{groupedSeats.length > 0 ? (
						<>
							{currentStep == 0 && (
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
							)}

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
											{numberFormat(
												selectedSeats
													.filter((seat) => seat.seat_type === "normal")
													.reduce((acc, seat) => acc + Number(seat.price), 0)
											)}
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
											{numberFormat(
												selectedSeats
													.filter((seat) => seat.seat_type === "vip")
													.reduce((acc, seat) => acc + Number(seat.price), 0)
											)}
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
											{numberFormat(
												selectedSeats
													.filter((seat) => seat.seat_type === "sweetbox")
													.reduce((acc, seat) => acc + Number(seat.price), 0)
											)}
										</span>
									</li>
								)}
							</ul>
						</>
					) : (
						<p className={clsx(styles["empty"])}>Chưa có ghế nào được chọn</p>
					)}
				</div>

				{currentStep >= 1 && (
					<div className={clsx(styles["summary-seats"], "mt-6")}>
						<h4 className={clsx(styles["summary-seats-title"])}>
							Đồ ăn đã chọn
						</h4>
						{Object.entries(selectedProducts).length > 0 ? (
							<ul className={clsx(styles["summary-prices-list"])}>
								{selectedProducts.map((product) => {
									const quantity = getProductQuantity(product.id);
									const price = product.price * quantity;
									if (quantity > 0) {
										return (
											<li
												className={clsx(styles["summary-prices-item"])}
												key={product.id}
											>
												<span>
													{product.name} ({quantity}):
												</span>
												<span>{numberFormat(price)}</span>
											</li>
										);
									}
									return null;
								})}
							</ul>
						) : (
							<p className={clsx(styles["empty"])}>
								Chưa có đồ ăn nào được chọn
							</p>
						)}
					</div>
				)}

				<div className={clsx(styles["summary-prices-total"])}>
					<span>Tổng tiền:</span>
					<span>{numberFormat(getTotal())}</span>
				</div>

				{/* Action buttons */}
				<div
					className={clsx(styles["navigation-buttons"], {
						[styles["navigation-buttons-end"]]: currentStep === 0,
					})}
				>
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
