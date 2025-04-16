import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import clsx from "clsx";

// import styles from "./User.module.scss";
import { userService } from "@/services";
import { PageWrapper, Card, Skeleton } from "@/components";

interface UserInterface {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	role: boolean;
	string_role: string;
	favorite_genres?: string[];
	statistics?: {
		monthlySpending?: number;
		yearlySpending?: number;
		totalBookings?: number;
		lastBooking?: string;
		upcomingBookings: number;
		favoriteTheater?: string;
		mostWatchedGenre?: string;
		averageBookingValue?: number;
	};
}

const UserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<UserInterface>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			if (!id) return;

			try {
				const response = await userService.getUserById(Number(id));
				// Thêm dữ liệu mẫu cho statistics
				const mockStatistics = {
					...response.data,
					statistics: {
						monthlySpending: 2500000,
						yearlySpending: 15000000,
						totalBookings: 12,
						lastBooking: "2024-04-05",
						upcomingBookings: 2,
						favoriteTheater: "CGV Vincom Center Đồng Khởi",
						mostWatchedGenre: "Hành động, Phiêu lưu",
						averageBookingValue: 208000,
					},
					favorite_genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
				};
				setUser(mockStatistics);
			} catch (error) {
				console.error(error);
				alert("Đã xảy ra lỗi. Vui lòng thử lại.");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [id]);

	const getAvatarUrl = (name: string) => {
		return `https://ui-avatars.com/api/?name=${encodeURIComponent(
			name
		)}&background=random&size=128`;
	};

	return (
		<PageWrapper title="Thông tin người dùng">
			<Card>
				{loading ? (
					<Skeleton.UserSkeleton />
				) : (
					user && (
						<div className="flex flex-col gap-6 p-4 pt-0">
							{/* User Avatar & Basic Info */}
							<div className="flex items-center p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<img
									src={getAvatarUrl(user.name)}
									alt={user.name}
									className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
								/>
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										{user.name}
									</h3>
									<p className="text-gray-500 text-sm">{user.string_role}</p>
								</div>
							</div>

							{/* User Details */}
							<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<div className="flex justify-between mb-2">
									<h3 className="text-lg font-bold">Thông tin cá nhân</h3>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<span className="text-sm text-gray-500">
											Tên người dùng
										</span>
										<span className="text-gray-900">{user.name}</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-sm text-gray-500">Email</span>
										<span className="text-gray-900">{user.email}</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-sm text-gray-500">Số điện thoại</span>
										<span className="text-gray-900">{user.phone}</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-sm text-gray-500">Địa chỉ</span>
										<span className="text-gray-900">{user.address}</span>
									</div>
								</div>
							</div>

							{/* User Statistics */}
							<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<div className="flex justify-between mb-2">
									<h3 className="text-lg font-bold">Thống kê chi tiêu</h3>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									<div className="bg-blue-50 rounded-xl p-4">
										<p className="text-sm text-blue-600 mb-1">
											Chi tiêu tháng này
										</p>
										<p className="text-xl font-semibold text-blue-700">
											{user.statistics?.monthlySpending?.toLocaleString(
												"vi-VN",
												{
													style: "currency",
													currency: "VND",
												}
											) || "0 ₫"}
										</p>
									</div>

									<div className="bg-green-50 rounded-xl p-4">
										<p className="text-sm text-green-600 mb-1">
											Chi tiêu năm nay
										</p>
										<p className="text-xl font-semibold text-green-700">
											{user.statistics?.yearlySpending?.toLocaleString(
												"vi-VN",
												{
													style: "currency",
													currency: "VND",
												}
											) || "0 ₫"}
										</p>
									</div>

									<div className="bg-purple-50 rounded-xl p-4">
										<p className="text-sm text-purple-600 mb-1">
											Tổng số vé đã đặt
										</p>
										<p className="text-xl font-semibold text-purple-700">
											{user.statistics?.totalBookings || 0} vé
										</p>
									</div>
								</div>
							</div>

							{/* User Preferences */}
							<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<div className="flex justify-between mb-2">
									<h3 className="text-lg font-bold">Sở thích và thói quen</h3>
								</div>
								<div className="grid grid-cols-2 gap-4">
									{user.statistics?.favoriteTheater && (
										<div className="flex flex-col gap-1">
											<span className="text-sm text-gray-500">
												Rạp yêu thích
											</span>
											<span className="text-gray-900">
												{user.statistics.favoriteTheater}
											</span>
										</div>
									)}
									{user.statistics?.mostWatchedGenre && (
										<div className="flex flex-col gap-1">
											<span className="text-sm text-gray-500">
												Thể loại xem nhiều
											</span>
											<span className="text-gray-900">
												{user.statistics.mostWatchedGenre}
											</span>
										</div>
									)}
									{user.statistics?.averageBookingValue && (
										<div className="flex flex-col gap-1">
											<span className="text-sm text-gray-500">
												Giá trị đặt vé trung bình
											</span>
											<span className="text-gray-900">
												{user.statistics.averageBookingValue.toLocaleString(
													"vi-VN",
													{
														style: "currency",
														currency: "VND",
													}
												)}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					)
				)}
			</Card>
		</PageWrapper>
	);
};

export default UserProfile;
