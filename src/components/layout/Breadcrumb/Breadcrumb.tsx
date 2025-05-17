import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Breadcrumb.module.scss";

const Breadcrumb = () => {
	const location = useLocation();
	const allPathnames = location.pathname
		.split("/")
		.filter((x) => x && x !== "rooms");

	const getDisplayName = (path: string) => {
		const routeMap: { [key: string]: string } = {
			admin: "Trang chủ",
			movies: "Quản lý phim",
			cinemas: "Quản lý rạp",
			showtimes: "Quản lý suất chiếu",
			bookings: "Quản lý đặt vé",
			users: "Quản lý người dùng",
			rooms: "Quản lý phòng chiếu",
			edit: "Chỉnh sửa",
			create: "Thêm mới",
			show: "Xem chi tiết",
		};

		if (!isNaN(Number(path))) {
			return "Xem chi tiết";
		}

		return routeMap[path] || path;
	};

	const getRouteLink = (name: string) => {
		const routeSegments = allPathnames.slice(
			0,
			allPathnames.findIndex((p) => p === name) + 1
		);
		return `/${routeSegments.join("/")}`;
	};

	return (
		<nav className={clsx(styles.breadcrumb)}>
			{allPathnames.map((name, index) => {
				const routeTo = getRouteLink(name);
				const isLast = index === allPathnames.length - 1;

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
