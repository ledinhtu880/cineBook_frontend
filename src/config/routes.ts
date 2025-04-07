const routes = {
	// #region Người dùng
	home: "/",
	now_showing: "/phim-dang-chieu",
	coming_soon: "/phim-sap-chieu",
	cinema: "/he-thong-rap",
	forgot_password: "/quen-mat-khau",
	not_found: "*",
	//#endregion

	// #region Quản trị viên
	admin: "/admin",
	admin_dashboard: "/admin/dashboard",
	admin_cinemas: "/admin/cinemas",
	admin_showtimes: "/admin/showtimes",
	admin_bookings: "/admin/bookings",

	// Quản lý phim
	admin_movies: "/admin/movies",
	admin_movies_create: "/admin/movies/create",
	admin_movies_edit: "/admin/movies/:id/edit",

	// Quản lý người dùngs
	admin_users: "/admin/users",
	admin_users_show: "/admin/users/:id",
};

export default routes;
