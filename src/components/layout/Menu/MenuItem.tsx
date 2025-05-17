import clsx from "clsx";
import { Link, useLocation } from "react-router-dom"; // Thêm useLocation
import { SvgIconComponent } from "@mui/icons-material";

import styles from "./Menu.module.scss";

interface MenuItemProps {
	item: {
		to: string;
		title: string;
		icon: SvgIconComponent;
	};
	isCollapse?: boolean;
}

const MenuItem = ({ item, isCollapse }: MenuItemProps) => {
	const location = useLocation();
	const isActive = location.pathname.startsWith(item.to);

	return (
		<li className={clsx(styles["menu-item"])}>
			<Link
				to={item.to}
				className={clsx(styles["menu-link"], {
					[styles.active]: isActive,
					[styles.collapse]: isCollapse,
				})}
			>
				<item.icon className={clsx(styles.icon)} />
				{!isCollapse && <span>{item.title}</span>}
			</Link>
		</li>
	);
};

export default MenuItem;
