const routes = {
	// #region Chung chung
	home: "/",
	now_showing: "/phim-dang-chieu",
	coming_soon: "/phim-sap-chieu",
	cinema: "/he-thong-rap",
	forgot_password: "/quen-mat-khau",
	not_found: "*",
	booking: "/dat-ve/:slug",

	movie_detail: "/phim/:slug",
	cinema_detail: "/rap/:slug",
	//#endregion

	// #region Quản trị viên
	admin_dashboard: "/admin/dashboard",
	admin_showtimes: "/admin/showtimes",
	admin_bookings: "/admin/bookings",

	// Quản lý phim
	admin_movies: "/admin/movies",
	admin_movies_create: "/admin/movies/create",
	admin_movies_edit: "/admin/movies/:id/edit",

	// Quản lý rạp chiếu phim
	admin_cinemas: "/admin/cinemas",
	admin_cinemas_create: "/admin/cinemas/create",
	admin_cinemas_detail: "/admin/cinemas/:id",
	admin_cinemas_edit: "/admin/cinemas/:id/edit",
	admin_cinemas_rooms_detail: "/admin/cinemas/:id/rooms/:id",
	admin_cinemas_rooms_create: "/admin/cinemas/:id/rooms/create",

	// Quản lý phòng chiếu phim

	// Quản lý người dùngs
	admin_users: "/admin/users",
	admin_users_show: "/admin/users/:id",
};

export default routes;
