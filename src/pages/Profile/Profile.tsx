"use client";

import type React from "react";

import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import {
	Edit,
	Save,
	CalendarMonth,
	LocationOn,
	MovieFilter,
	EventSeat,
	AccessTime,
	Receipt,
} from "@mui/icons-material";
import { useSnackbar } from "@/context";

import styles from "./Profile.module.scss";
import config from "@/config";
import { useAuth } from "@/hooks";
import { getFirstLetter } from "@/utils";
import {
	Container,
	Card,
	Button,
	Input,
	Image,
	Badge,
	Loading,
} from "@/components";
import { PasswordChangeModal } from "./PasswordChangeModal";
import type { ValidationErrors, ApiError, UserProps } from "@/types";
import { authService, bookingService } from "@/services";

interface BookingProps {
	code: string;
	movie: string;
	cinema: string;
	date: string;
	time: string;
	seats: string;
	total: string;
	status: string;
	posterUrl: string;
}

export default function Profile() {
	const { isLoggedIn, setIsLoginOpen, renderLoginModals, user, handleLogout } =
		useAuth();

	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<UserProps>({
		id: user?.id || -1,
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		string_role: user?.string_role || "",
		phone: user?.phone || "",
		name: user?.name || "",
		email: user?.email || "",
		role: user?.role || false,
		city: user?.city || { id: -1, name: "" },
	});
	const [bookingHistory, setBookingHistory] = useState<BookingProps[]>([]);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [modalErrors, setModalErrors] = useState<ValidationErrors>({});
	const { showSnackbar } = useSnackbar();

	const fetchUserData = useCallback(() => {
		if (user) {
			setUserData({
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				string_role: user.string_role,
				phone: user.phone,
				name: user.name,
				email: user.email,
				role: user.role,
				city: user.city,
			});
		}
	}, [user]);

	const fetchBookingHistory = useCallback(async () => {
		try {
			const response = await bookingService.get();
			setBookingHistory(response);
		} catch (error) {
			console.error("Xảy ra lỗi khi lấy lịch sử đặt vé:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUserData();

		if (isLoggedIn && user) {
			fetchBookingHistory();
		}
	}, [user, isLoggedIn, fetchUserData, fetchBookingHistory]);

	const handleEditToggle = useCallback(() => {
		setIsEditing(!isEditing);

		if (isEditing) {
			authService.update(userData);
		}
	}, [isEditing, userData]);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setUserData((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[]
	);

	const handlePasswordChange = useCallback(
		async (data: {
			currentPassword: string;
			newPassword: string;
			confirmPassword: string;
		}) => {
			try {
				setModalErrors({});

				const response = await authService.changePassword(
					data.currentPassword,
					data.newPassword,
					data.confirmPassword
				);

				if (response.status === "success") {
					setIsPasswordModalOpen(false);
					showSnackbar(response.message, "success");
					setModalErrors({});
				} else {
					setModalErrors({ general: response.message });
				}
			} catch (error) {
				console.error("Lỗi khi đổi mật khẩu:", error);
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
					setModalErrors(validationErrors);
				} else {
					setModalErrors({ general: "Đã có lỗi xảy ra. Vui lòng thử lại." });
				}
			}
		},
		[showSnackbar]
	);

	if (!isLoggedIn) {
		setIsLoginOpen(true);
		return renderLoginModals(true);
	}

	if (loading) {
		return <Loading full />;
	}

	return (
		<Container className={clsx(styles.wrapper)}>
			<div className={clsx(styles.header, "mb-6")}>
				<h4
					className={clsx(
						styles["header-title"],
						"border-left-accent",
						"text-2xl"
					)}
				>
					Thông tin tài khoản
				</h4>
			</div>
			<div className={clsx(styles.content)}>
				<div className={clsx(styles["content-left"])}>
					<Card>
						<div className={clsx(styles["avatar-card"])}>
							<div className={clsx(styles["avatar"])}>
								<span className={clsx(styles["avatar-title"])}>
									{getFirstLetter(user?.name)}
								</span>
							</div>
							<div className={clsx(styles["avatar-info-wrapper"])}>
								<h1>{user?.name}</h1>
								<h2>{userData.email}</h2>

								<div className={clsx(styles["avatar-button-wrapper"])}>
									<Button
										primary
										className="w-full py-2.5"
										onClick={() => setIsPasswordModalOpen(true)}
									>
										Đổi mật khẩu
									</Button>
									<Button
										outline
										className="w-full py-2.5"
										onClick={handleLogout}
									>
										Đăng xuất
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</div>

				<div className={clsx(styles["content-right"])}>
					<Card
						title="Thông tin cá nhân"
						actionButton={
							<Button
								onClick={handleEditToggle}
								leftIcon={isEditing ? <Save /> : <Edit />}
								primary={isEditing}
								outline={!isEditing}
							>
								{isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
							</Button>
						}
					>
						<div className={clsx(styles["info-card"])}>
							<Input
								id="last_name"
								value={userData.last_name}
								onChange={handleInputChange}
								label="Họ"
							/>
							<Input
								id="first_name"
								value={userData.first_name}
								onChange={handleInputChange}
								label="Tên"
							/>
							<div>
								<Input
									id="email"
									label="Email"
									value={userData.email}
									onChange={handleInputChange}
									readOnly
								/>
								<p className={clsx(styles["info-note"])}>
									Email không thể thay đổi
								</p>
							</div>
							<div>
								<Input
									id="phone"
									label="Số điện thoại"
									value={userData.phone}
									onChange={handleInputChange}
									readOnly
								/>
								<p className={clsx(styles["info-note"])}>
									Số điện thoại không thể thay đổi
								</p>
							</div>
						</div>
					</Card>

					<Card title="Lịch sử đặt vé">
						{bookingHistory.length > 0 ? (
							<div className={clsx(styles["booking-card"])}>
								{bookingHistory.map((booking) => (
									<div
										key={booking.code}
										className={clsx(styles["booking-item-wrapper"])}
									>
										<div className={clsx(styles["booking-item"])}>
											<div className={clsx(styles["booking-poster"])}>
												<Image src={booking.posterUrl} alt={booking.movie} />
											</div>

											<div className={clsx(styles["booking-info-wrapper"])}>
												<div className={clsx(styles["booking-info"])}>
													<h3 className={clsx(styles["booking-title"])}>
														{booking.movie}
													</h3>
													<Badge
														className={clsx(
															"booking-badge",
															booking.status === "Hoàn thành"
																? "bg-green-500"
																: "bg-amber-500"
														)}
													>
														{booking.status}
													</Badge>
												</div>
												<div
													className={clsx(styles["booking-details-wrapper"])}
												>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<Receipt
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Mã đặt vé:
														</span>
														<span
															className={clsx(styles["booking-meta-value"])}
														>
															{booking.code}
														</span>
													</div>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<EventSeat
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Ghế:
														</span>
														<span
															className={clsx(styles["booking-meta-value"])}
														>
															{booking.seats}
														</span>
													</div>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<LocationOn
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Rạp:
														</span>
														<span
															className={clsx(styles["booking-meta-value"])}
														>
															{booking.cinema}
														</span>
													</div>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<Receipt
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Tổng tiền:
														</span>
														<span className="font-semibold">
															{booking.total}
														</span>
													</div>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<CalendarMonth
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Ngày:
														</span>
														<span
															className={clsx(styles["booking-meta-value"])}
														>
															{booking.date}
														</span>
													</div>
													<div className={clsx(styles["booking-detail"])}>
														<span className={clsx(styles["booking-meta-key"])}>
															<AccessTime
																className={clsx(styles["booking-meta-icon"])}
															/>{" "}
															Giờ:
														</span>
														<span
															className={clsx(styles["booking-meta-value"])}
														>
															{booking.time}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className={clsx(styles["booking-empty"])}>
								<MovieFilter
									className={clsx(styles["booking-icon"])}
									style={{ fontSize: "48px" }}
								/>
								<p className={clsx(styles["booking-title"])}>
									Bạn chưa đặt vé nào
								</p>
								<Button primary to={config.routes.now_showing}>
									Đặt vé ngay
								</Button>
							</div>
						)}
					</Card>
				</div>
			</div>

			<PasswordChangeModal
				isOpen={isPasswordModalOpen}
				onClose={() => setIsPasswordModalOpen(false)}
				onSubmit={handlePasswordChange}
				errors={modalErrors}
				clearErrors={() => setModalErrors({})}
			/>
		</Container>
	);
}
