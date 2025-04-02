import clsx from "clsx";
import { SvgIconComponent } from "@mui/icons-material";
import { MoreHoriz } from "@mui/icons-material";

import styles from "./Menu.module.scss";
import MenuItem from "./MenuItem";

interface MenuProps {
	title: string;
	data: Array<{
		to: string;
		title: string;
		icon: SvgIconComponent;
	}>;
	isCollapse?: boolean;
}

const Menu: React.FC<MenuProps> = ({ title, data, isCollapse }) => {
	return (
		<nav
			className={clsx(styles["menu-wrapper"], {
				[styles.collapse]: isCollapse,
			})}
		>
			{!isCollapse ? (
				<h3 className={clsx(styles["menu-group-title"])}>{title}</h3>
			) : (
				<MoreHoriz className={clsx(styles["more"])} />
			)}
			<ul className={clsx(styles["menu-group"])}>
				{data.map((item, index) => (
					<MenuItem item={item} key={index} isCollapse={isCollapse} />
				))}
			</ul>
		</nav>
	);
};

export default Menu;
