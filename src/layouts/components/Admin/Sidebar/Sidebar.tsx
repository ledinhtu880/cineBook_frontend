import clsx from "clsx";
import { Link } from "react-router-dom";

import {
	GridView,
	Movie,
	Theaters,
	Schedule,
	ConfirmationNumber,
	People,
} from "@mui/icons-material";

import styles from "./Sidebar.module.scss";
import Image from "@/components/Image";
import Menu from "@/components/Menu";
import images from "@/assets/images";
import config from "@/config";

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
			title: "Rạp/phòng chiếu",
		},
		{
			to: config.routes.admin_showtimes,
			icon: Schedule,
			title: "Suất chiếu",
		},
		{
			to: config.routes.admin_bookings,
			icon: ConfirmationNumber,
			title: "Đặt vé",
		},
		{
			to: config.routes.admin_users,
			icon: People,
			title: "Người dùng",
		},
	];

	return (
		<aside className={clsx(styles.wrapper, { [styles.collapse]: isCollapse })}>
			<Link to={config.routes.admin_dashboard} tabIndex={-1}>
				<Image src={images.logo} alt="Logo" className={clsx(styles["logo"])} />
			</Link>
			<div className={clsx(styles["menu-wrapper"], "no-scrollbar")}>
				<Menu title="Menu" data={menuList} isCollapse={isCollapse} />
			</div>
		</aside>
	);
};

export default Sidebar;
