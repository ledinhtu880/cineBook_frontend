import config from "@config/index";
import {
	Home,
	NowShowing,
	ComingSoon,
	Cinema,
	Admin,
	NotFoundPage,
} from "../pages";

// Không đăng nhập vẫn xem được
const publicRoutes = [
	{ path: config.routes.home, component: Home, title: "Trang chủ" },
	{
		path: config.routes.now_showing,
		component: NowShowing,
		title: "Phim đang chiếu",
	},
	{
		path: config.routes.coming_soon,
		component: ComingSoon,
		title: "Phim sắp chiếu",
	},
	{ path: config.routes.cinema, component: Cinema, title: "Rạp chiếu" },
	{
		path: config.routes.not_found,
		component: NotFoundPage,
		title: "Không tìm thấy trang",
	},
];

// Đăng nhập mới xem được
const privateRoutes = [];

const adminRoutes = [
	{
		path: config.routes.admin_dashboard,
		component: Admin.Dashboard,
		title: "Dashboard",
	},
	{
		path: config.routes.admin_movies,
		component: Admin.Movie,
		title: "Quản lý phim",
	},
	{
		path: config.routes.admin_cinemas,
		component: Admin.Cinema,
		title: "Quản lý rạp",
	},
	{
		path: config.routes.admin_showtimes,
		component: Admin.Showtime,
		title: "Quản lý suất chiếu",
	},
	{
		path: config.routes.admin_bookings,
		component: Admin.Booking,
		title: "Quản lý đặt vé",
	},

	// Quản lý người dùng
	{
		path: config.routes.admin_users,
		component: Admin.User.default,
		title: "Quản lý người dùng",
	},
	{
		path: config.routes.admin_users_edit,
		component: Admin.User.UserEdit,
		title: "Chỉnh sửa người dùng",
	},
];

export { publicRoutes, privateRoutes, adminRoutes };
