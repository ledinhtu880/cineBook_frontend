import config from "@config/index";
import { Home, NowShowing, ComingSoon, Cinema, Admin } from "../pages";

// Không đăng nhập vẫn xem được
const publicRoutes = [
	{ path: config.routes.home, component: Home },
	{ path: config.routes.now_showing, component: NowShowing },
	{ path: config.routes.coming_soon, component: ComingSoon },
	{ path: config.routes.cinema, component: Cinema },
];

// Đăng nhập mới xem được
const privateRoutes = [];

const adminRoutes = [
	{ path: config.routes.admin_dashboard, component: Admin.Dashboard },
	{ path: config.routes.admin_movies, component: Admin.Movie },
	{ path: config.routes.admin_cinemas, component: Admin.Cinema },
	{ path: config.routes.admin_showtimes, component: Admin.Showtime },
	{ path: config.routes.admin_bookings, component: Admin.Booking },
	{ path: config.routes.admin_users, component: Admin.User },
];

export { publicRoutes, privateRoutes, adminRoutes };
