"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
	ArrowForward,
} from "@mui/icons-material";

import styles from "./Profile.module.scss";
import { useAuth } from "@/hooks";
import type { UserProps } from "@/types";
import { getFirstLetter } from "@/utils";
import { bookingService } from "@/services";
import { Container, Card, Button, Input, Badge } from "@/components";

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
	const {
		isLoggedIn,
		setIsLoginOpen,
		LoginModalComponent,
		user,
		handleLogout,
	} = useAuth();

	const [isEditing, setIsEditing] = useState(false);
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

	useEffect(() => {
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
		(async () => {
			try {
				const response = await bookingService.get();
				setBookingHistory(response.data);
			} catch (error) {
				console.error("Xảy ra lỗi khi lấy lịch sử đặt vé:", error);
			}
		})();
	}, [user]);

	const handleEditToggle = () => {
		if (isEditing) {
			console.log("Saving user data:", userData);
		}
		setIsEditing(!isEditing);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (!isLoggedIn) {
		setIsLoginOpen(true);
		return <LoginModalComponent />;
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
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar - Left Column */}
				<div className="w-full md:w-1/4">
					<Card className="pb-6">
						<div className="flex flex-col justify-center items-center gap-6">
							<div className="bg-primary text-primary-foreground w-28 h-28 rounded-full relative flex items-center justify-center shadow-md mt-6">
								<span className="text-white text-3xl font-bold">
									{getFirstLetter(user?.name)}
								</span>
							</div>
							<div className="text-center w-full px-8">
								<h1 className="text-2xl font-semibold mb-1">{user?.name}</h1>
								<h2 className="text-gray-500 text-sm mb-6">{userData.email}</h2>

								<div className="space-y-3 w-full">
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

				{/* Main Content - Right Column */}
				<div className="flex-1 flex flex-col gap-8">
					{/* User Information Card */}
					<Card
						title="Thông tin cá nhân"
						actionButton={
							<Button
								onClick={handleEditToggle}
								leftIcon={isEditing ? <Save /> : <Edit />}
								primary={isEditing}
								outline={!isEditing}
								className="px-4"
							>
								{isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
							</Button>
						}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-6 py-2">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Họ và tên
								</label>
								<Input
									name="name"
									value={userData.name}
									onChange={handleInputChange}
									className="w-full py-2.5"
									readOnly={!isEditing}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Thành phố
								</label>
								<Input
									name="address"
									value={userData.city?.name}
									onChange={handleInputChange}
									className="w-full py-2.5"
									readOnly
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email
								</label>
								<Input
									name="email"
									value={userData.email}
									onChange={handleInputChange}
									className="w-full py-2.5"
									readOnly
								/>
								<p className="text-xs text-gray-500 mt-1.5">
									Email không thể thay đổi
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Số điện thoại
								</label>
								<Input
									name="phone"
									value={userData.phone}
									onChange={handleInputChange}
									className="w-full py-2.5"
									readOnly
								/>
								<p className="text-xs text-gray-500 mt-1.5">
									Số điện thoại không thể thay đổi
								</p>
							</div>
						</div>
					</Card>

					{/* Booking History Card */}
					<Card title="Lịch sử đặt vé">
						{bookingHistory.length > 0 ? (
							<div className="space-y-6 px-6 py-2">
								{bookingHistory.map((booking) => (
									<div
										key={booking.code}
										className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
									>
										<div className="flex flex-col md:flex-row gap-6">
											{/* Poster Image */}
											<div className="w-40 h-auto flex-shrink-0 mx-auto md:mx-0">
												<img
													src={booking.posterUrl || "/placeholder.svg"}
													alt={booking.movie}
													className="w-full h-full object-cover rounded-md shadow-sm"
												/>
											</div>

											{/* Booking Details */}
											<div className="flex-grow">
												<div className="flex justify-between items-start mb-3">
													<h3 className="font-semibold text-lg">
														{booking.movie}
													</h3>
													<Badge
														className={clsx(
															"text-xs px-3 py-1",
															booking.status === "Hoàn thành"
																? "bg-green-500"
																: "bg-amber-500"
														)}
													>
														{booking.status}
													</Badge>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
													<div className="flex items-center">
														<span className="text-gray-500 mr-2 flex items-center">
															<Receipt className="w-4 h-4 mr-1" /> Mã đặt vé:
														</span>{" "}
														<span className="font-medium">{booking.code}</span>
													</div>
													<div className="flex items-center">
														<span className="text-gray-500 mr-2 flex items-center">
															<EventSeat className="w-4 h-4 mr-1" /> Ghế:
														</span>{" "}
														<span className="font-medium">{booking.seats}</span>
													</div>
													<div className="flex items-center">
														<span className="text-gray-500 mr-2 flex items-center">
															<LocationOn className="w-4 h-4 mr-1" /> Rạp:
														</span>{" "}
														<span className="font-medium">
															{booking.cinema}
														</span>
													</div>
													<div className="flex items-center font-medium text-primary">
														<span className="text-gray-500 mr-2 flex items-center">
															<Receipt className="w-4 h-4 mr-1" /> Tổng tiền:
														</span>{" "}
														<span className="font-semibold">
															{booking.total}
														</span>
													</div>
													<div className="flex items-center">
														<span className="text-gray-500 mr-2 flex items-center">
															<CalendarMonth className="w-4 h-4 mr-1" /> Ngày:
														</span>{" "}
														<span className="font-medium">{booking.date}</span>
													</div>
													<div className="flex items-center">
														<span className="text-gray-500 mr-2 flex items-center">
															<AccessTime className="w-4 h-4 mr-1" /> Giờ:
														</span>{" "}
														<span className="font-medium">{booking.time}</span>
													</div>
												</div>

												<div className="mt-4 text-right">
													<Button outline className="text-sm px-4 py-1.5">
														Xem chi tiết{" "}
														<ArrowForward className="w-3 h-3 ml-1" />
													</Button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12 bg-gray-50 rounded-lg mx-6 my-4">
								<MovieFilter
									className="mx-auto text-gray-400 mb-3"
									style={{ fontSize: "48px" }}
								/>
								<p className="text-gray-500 text-lg mb-4">
									Bạn chưa đặt vé nào
								</p>
								<Button primary>Đặt vé ngay</Button>
							</div>
						)}
					</Card>
				</div>
			</div>

			{/* Password Modal */}
			{isPasswordModalOpen && <h1>Hello</h1>}
		</Container>
	);
}
