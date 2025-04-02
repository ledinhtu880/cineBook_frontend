import clsx from "clsx";
import { Menu } from "@mui/icons-material";

import styles from "./Header.module.scss";
import Button from "@/components/Button";

interface HeaderProps {
	onCollapse: () => void;
}

const Header = ({ onCollapse }: HeaderProps) => {
	return (
		<header className={clsx(styles["header"])}>
			<div className={clsx(styles["header-wrapper"])}>
				<div className={clsx(styles["header-left"])}>
					<Button
						className={styles["btn-collapse"]}
						size="no-padding"
						outline
						onClick={onCollapse}
					>
						<Menu />
					</Button>
				</div>
				<div className={clsx(styles["header-right"])}>Avatar</div>
			</div>
		</header>
	);
};

export default Header;
