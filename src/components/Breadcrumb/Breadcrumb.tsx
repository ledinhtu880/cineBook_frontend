import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Breadcrumb.module.scss";

const Breadcrumb = () => {
	const location = useLocation();
	const pathnames = location.pathname
		.split("/")
		.filter((x) => x)
		.filter((path) => isNaN(Number(path)));

	// Map route to display name
	const getDisplayName = (path: string) => {
		const routeMap: { [key: string]: string } = {
			admin: "Trang chủ",
			movies: "Quản lý phim",
			cinemas: "Quản lý rạp",
			showtimes: "Quản lý suất chiếu",
			bookings: "Quản lý đặt vé",
			users: "Quản lý người dùng",
			edit: "Chỉnh sửa",
			create: "Thêm mới",
		};
		return routeMap[path] || path;
	};

	return (
		<nav className={clsx(styles.breadcrumb)}>
			{pathnames.map((name, index) => {
				const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
				const isLast = index === pathnames.length - 1;

				return (
					<span key={name} className={clsx(styles.item)}>
						<Link
							to={routeTo}
							className={clsx(styles.link, {
								[styles.active]: isLast,
							})}
						>
							{getDisplayName(name)}
						</Link>
						{!isLast && <ChevronRight className={clsx(styles.separator)} />}
					</span>
				);
			})}
		</nav>
	);
};

export default Breadcrumb;
