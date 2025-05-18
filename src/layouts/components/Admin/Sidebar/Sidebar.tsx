import { Link } from "react-router-dom";
import {
	GridView,
	Movie,
	Theaters,
	Schedule,
	People,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Sidebar.module.scss";
import config from "@/config";
import { Menu } from "@/components";

interface SidebarProps {
	isCollapse: boolean;
}

const Sidebar = ({ isCollapse }: SidebarProps) => {
	const menuList = [
		{
			to: config.routes.admin_dashboard,
			icon: GridView,
			title: "Tổng quan",
		},
		{
			to: config.routes.admin_movies,
			icon: Movie,
			title: "Phim",
		},
		{
			to: config.routes.admin_cinemas,
			icon: Theaters,
			title: "Rạp chiếu phim",
		},
		{
			to: config.routes.admin_showtimes,
			icon: Schedule,
			title: "Suất chiếu",
		},
		{
			to: config.routes.admin_users,
			icon: People,
			title: "Người dùng",
		},
	];

	return (
		<aside className={clsx(styles.wrapper, { [styles.collapse]: isCollapse })}>
			<Link to={config.routes.admin_dashboard} className={clsx(styles.logo)}>
				🎬 CineBook
			</Link>
			<div className={clsx(styles["menu-wrapper"], "no-scrollbar")}>
				<Menu title="Menu" data={menuList} isCollapse={isCollapse} />
			</div>
		</aside>
	);
};

export default Sidebar;
