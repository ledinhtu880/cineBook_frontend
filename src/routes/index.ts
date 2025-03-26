import config from "../config";
// pages
import { Home, Movie } from "../pages";

// Không đăng nhập vẫn xem được
const publicRoutes = [
	{ path: config.routes.home, component: Home },
	{ path: config.routes.movie, component: Movie },
];

// Đăng nhập mới xem được
const privateRoutes = [];

export { publicRoutes, privateRoutes };
