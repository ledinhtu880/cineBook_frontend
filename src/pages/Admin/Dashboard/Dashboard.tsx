"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card } from "@/components/";
import {
	Movie as Film,
	CalendarMonth as Calendar,
	ConfirmationNumber as Ticket,
	AttachMoney as DollarSign,
	TrendingUp,
	AccessTime as Clock,
	EmojiEvents as Trophy,
	BarChart,
	ShowChart,
} from "@mui/icons-material";

interface ChartData {
	revenueChart: { date: string; revenue: number }[];
	weeklyBookings: { day: string; bookings: number }[];
	topCinemas: { name: string; revenue: number; bookings: number }[];
}

const mockChartData: ChartData = {
	revenueChart: [
		{ date: "T2", revenue: 18500000 },
		{ date: "T3", revenue: 23200000 },
		{ date: "T4", revenue: 15600000 },
		{ date: "T5", revenue: 26800000 },
		{ date: "T6", revenue: 31200000 },
		{ date: "T7", revenue: 35400000 },
		{ date: "CN", revenue: 33100000 },
	],
	weeklyBookings: [
		{ day: "T2", bookings: 185 },
		{ day: "T3", bookings: 232 },
		{ day: "T4", bookings: 156 },
		{ day: "T5", bookings: 268 },
		{ day: "T6", bookings: 312 },
		{ day: "T7", bookings: 354 },
		{ day: "CN", bookings: 331 },
	],
	topCinemas: [
		{ name: "CGV Vincom Center", revenue: 28700000, bookings: 287 },
		{ name: "Lotte Cinema Landmark", revenue: 23400000, bookings: 234 },
		{ name: "Galaxy Nguyễn Du", revenue: 19800000, bookings: 198 },
		{ name: "BHD Star Bitexco", revenue: 16700000, bookings: 167 },
	],
};

interface DashboardStats {
	totalMovies: number;
	totalShowtimes: number;
	totalBookings: number;
	totalRevenue: number;
	todayBookings: number;
	todayRevenue: number;
}

// Mock data
const mockStats: DashboardStats = {
	totalMovies: 125,
	totalShowtimes: 348,
	totalBookings: 1838,
	totalRevenue: 183800000,
	todayBookings: 331,
	todayRevenue: 33100000,
};

// Loading Skeleton Component
const Skeleton = ({ className }: { className: string }) => (
	<div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

const CardContent = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => <div className={className}>{children}</div>;

const CardHeader = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => <div className={className}>{children}</div>;

const CardTitle = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => <h3 className={className}>{children}</h3>;

export default function Dashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalMovies: 0,
		totalShowtimes: 0,
		totalBookings: 0,
		totalRevenue: 0,
		todayBookings: 0,
		todayRevenue: 0,
	});
	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<ChartData>(mockChartData);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				setStats(mockStats);
				setChartData(mockChartData);
			} catch (error) {
				console.error("Dashboard error:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const formatCurrency = (amount: number) => {
		if (amount >= 1000000000) {
			return `${(amount / 1000000000).toFixed(1)} tỷ`;
		}
		if (amount >= 1000000) {
			return `${(amount / 1000000).toFixed(1)} triệu`;
		}
		if (amount >= 1000) {
			return `${(amount / 1000).toFixed(1)} nghìn`;
		}
		return `${amount.toLocaleString("vi-VN")} ₫`;
	};

	const SimpleBarChart = ({
		data,
	}: {
		data: { date: string; revenue: number }[];
	}) => {
		const maxRevenue = Math.max(...data.map((d) => d.revenue));

		return (
			<div className="space-y-4">
				<div className="flex justify-between items-end h-48 gap-3 px-2">
					{data.map((item, index) => {
						const height = Math.max((item.revenue / maxRevenue) * 100, 8);
						return (
							<div
								key={index}
								className="flex flex-col items-center flex-1 h-full justify-end"
							>
								<div
									className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 relative group cursor-pointer min-w-0 flex items-end justify-center"
									style={{
										height: `${height}%`,
									}}
								>
									{/* Tooltip hiển thị giá trị */}
									<div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
										{formatCurrency(item.revenue)}
										<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
									</div>
								</div>
								<span className="text-sm text-slate-600 mt-3 font-medium">
									{item.date}
								</span>
							</div>
						);
					})}
				</div>
				<div className="border-t pt-4">
					<div className="text-center text-sm text-slate-600 font-medium mb-1">
						Doanh thu theo tuần
					</div>
					<div className="text-center text-sm text-emerald-600 font-bold">
						Tổng tuần này:
						{formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
					</div>
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="p-6 space-y-8">
				<div className="flex items-center justify-between">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-8 w-32" />
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i} className="p-6 bg-white/50">
							<div className="flex justify-between items-center">
								<div>
									<Skeleton className="h-4 w-24 mb-3" />
									<Skeleton className="h-8 w-20" />
								</div>
								<Skeleton className="h-12 w-12 rounded-full" />
							</div>
						</Card>
					))}
				</div>

				<Card className="p-6 bg-white/50">
					<Skeleton className="h-7 w-40 mb-4" />
					<div className="grid gap-4 md:grid-cols-2">
						<Skeleton className="h-20 w-full rounded-lg" />
						<Skeleton className="h-20 w-full rounded-lg" />
					</div>
				</Card>

				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="lg:col-span-2 p-6 bg-white/50">
						<Skeleton className="h-7 w-40 mb-6" />
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className="h-24 w-full rounded-lg" />
							))}
						</div>
					</Card>
					<Card className="p-6 bg-white/50">
						<Skeleton className="h-7 w-32 mb-6" />
						<div className="space-y-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full rounded-lg" />
							))}
						</div>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
						Dashboard
					</h1>
					<p className="text-slate-600">
						Tổng quan hệ thống quản lý rạp chiếu phim
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm text-slate-500 mt-4 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm">
					<Clock className="h-4 w-4 text-blue-500" />
					Cập nhật lúc {new Date().toLocaleTimeString("vi-VN")}
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-blue-100 text-sm font-medium">
									Tổng số phim
								</p>
								<p className="text-3xl font-bold mt-2">
									{stats.totalMovies.toLocaleString()}
								</p>
							</div>
							<div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
								<Film className="h-8 w-8" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-purple-100 text-sm font-medium">
									Tổng suất chiếu
								</p>
								<p className="text-3xl font-bold mt-2">
									{stats.totalShowtimes.toLocaleString()}
								</p>
							</div>
							<div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
								<Calendar className="h-8 w-8" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-cyan-100 text-sm font-medium">
									Tổng đơn đặt vé
								</p>
								<p className="text-3xl font-bold mt-2">
									{stats.totalBookings.toLocaleString()}
								</p>
							</div>
							<div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
								<Ticket className="h-8 w-8" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-emerald-100 text-sm font-medium">
									Tổng doanh thu
								</p>
								<p className="text-2xl font-bold mt-2">
									{formatCurrency(stats.totalRevenue)}
								</p>
							</div>
							<div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
								<DollarSign className="h-8 w-8" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Today Stats */}
			<Card className="border-0 shadow-md bg-white">
				<CardHeader className="pb-3 pt-6 px-6">
					<CardTitle className="flex items-center gap-2 text-slate-800 text-xl font-bold">
						<TrendingUp className="h-5 w-5 text-emerald-600" />
						Thống kê hôm nay
					</CardTitle>
				</CardHeader>
				<CardContent className="px-6 pb-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all duration-200">
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
									<Ticket className="h-6 w-6 text-white" />
								</div>
								<span className="font-medium text-slate-700">Đơn đặt vé:</span>
							</div>
							<span className="text-2xl font-bold text-blue-600">
								{stats.todayBookings}
							</span>
						</div>
						<div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border-l-4 border-emerald-500 hover:shadow-md transition-all duration-200">
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
									<DollarSign className="h-6 w-6 text-white" />
								</div>
								<span className="font-medium text-slate-700">Doanh thu:</span>
							</div>
							<span className="text-2xl font-bold text-emerald-600">
								{formatCurrency(stats.todayRevenue)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Content Grid */}
			<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
				{/* Revenue Chart */}
				<Card className="border-0 shadow-md bg-white">
					<CardHeader className="pt-6 px-6 pb-4">
						<CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
							<BarChart className="h-5 w-5 text-blue-600" />
							Doanh thu 7 ngày qua
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<SimpleBarChart data={chartData.revenueChart} />
					</CardContent>
				</Card>

				{/* Weekly Bookings */}
				<Card className="border-0 shadow-md bg-white lg:col-span-2 xl:col-span-1">
					<CardHeader className="pt-6 px-6 pb-4">
						<CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
							<ShowChart className="h-5 w-5 text-emerald-600" />
							Lượt đặt vé tuần này
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-3">
							{chartData.weeklyBookings.map((item, index) => {
								const maxBookings = Math.max(
									...chartData.weeklyBookings.map((d) => d.bookings)
								);
								const percentage = (item.bookings / maxBookings) * 100;

								return (
									<div key={index} className="space-y-1">
										<div className="flex justify-between text-sm">
											<span className="font-medium text-slate-700">
												{item.day}
											</span>
											<span className="font-bold text-slate-900">
												{item.bookings}
											</span>
										</div>
										<div className="w-full bg-slate-200 rounded-full h-2">
											<div
												className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Additional Stats Grid */}
			<div className="grid gap-6 lg:grid-cols-1">
				{/* Top Cinemas */}
				<Card className="border-0 shadow-md bg-white">
					<CardHeader className="pt-6 px-6 pb-4">
						<CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
							<Trophy className="h-5 w-5 text-yellow-600" />
							Rạp chiếu hàng đầu
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-4">
							{chartData.topCinemas.map((cinema, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:shadow-md transition-all duration-200"
								>
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 text-white font-bold text-sm rounded-full">
											#{index + 1}
										</div>
										<div>
											<h4 className="font-medium text-slate-900 text-sm">
												{cinema.name}
											</h4>
											<p className="text-xs text-slate-600">
												{cinema.bookings} lượt đặt
											</p>
										</div>
									</div>
									<div className="text-right">
										<div className="font-bold text-emerald-600">
											{formatCurrency(cinema.revenue)}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
