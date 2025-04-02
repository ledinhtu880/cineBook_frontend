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

const adminRoutes = [{ path: config.routes.admin, component: Admin.Dashboard }];

export { publicRoutes, privateRoutes, adminRoutes };
