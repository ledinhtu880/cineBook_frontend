import config from "@/config";
import {
	Home,
	NowShowing,
	ComingSoon,
	Cinema,
	CinemaDetail,
	Admin,
	Movie,
	Booking,
	Search,
	Profile,
} from "@/pages";

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
	{
		path: config.routes.movie_detail,
		component: Movie,
		title: "Xem chi tiết phim",
	},
	{
		path: config.routes.cinema_detail,
		component: CinemaDetail,
		title: "Lịch chiếu phim của rạp",
	},
	{ path: config.routes.cinema, component: Cinema, title: "Rạp chiếu" },
	{ path: config.routes.search, component: Search, title: "Tìm kiếm" },
];

// Đăng nhập mới xem được
const privateRoutes = [
	{
		path: config.routes.booking,
		component: Booking,
		title: "Đặt vé",
	},
	{
		path: config.routes.profile,
		component: Profile,
		title: "Xem thông tin tài khoản",
	},
];

const adminRoutes = [
	{
		path: config.routes.admin_dashboard,
		component: Admin.Dashboard,
		title: "Dashboard",
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

	// #region Quản lý phim
	{
		path: config.routes.admin_movies,
		component: Admin.Movie.default,
		title: "Quản lý phim",
	},
	{
		path: config.routes.admin_movies_create,
		component: Admin.Movie.Create,
		title: "Thêm phim mới",
	},
	{
		path: config.routes.admin_movies_edit,
		component: Admin.Movie.Edit,
		title: "Chỉnh sửa phim",
	},
	// #endregion

	// #region Quản lý rạp chiếu phim
	{
		path: config.routes.admin_cinemas,
		component: Admin.Cinema.default,
		title: "Quản lý rạp chiếu phim",
	},
	{
		path: config.routes.admin_cinemas_create,
		component: Admin.Cinema.Create,
		title: "Thêm rạp chiếu phim",
	},
	{
		path: config.routes.admin_cinemas_edit,
		component: Admin.Cinema.Edit,
		title: "Chỉnh sửa rạp chiếu phim",
	},
	{
		path: config.routes.admin_cinemas_detail,
		component: Admin.Cinema.Show,
		title: "Xem thông tin rạp chiếu phim",
	},
	{
		path: config.routes.admin_cinemas_rooms_detail,
		component: Admin.Cinema.RoomShow,
		title: "Xem thông tin phòng chiếu",
	},
	{
		path: config.routes.admin_cinemas_rooms_create,
		component: Admin.Cinema.RoomCreate,
		title: "Tạo phòng chiếu",
	},
	// #endregion

	// #region Quản lý người dùng
	{
		path: config.routes.admin_users,
		component: Admin.User.default,
		title: "Quản lý người dùng",
	},
	{
		path: config.routes.admin_users_show,
		component: Admin.User.UserProfile,
		title: "Xem thông tin người dùng",
	},
	// #endregion
];

export { publicRoutes, privateRoutes, adminRoutes };
