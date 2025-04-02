import clsx from "clsx";
import styles from "./Header.module.scss";

const Header = () => {
	return (
		<header className={clsx(styles["header"])}>
			<div className={clsx(styles["header-wrapper"])}>
				<div className={clsx(styles["header-left"])}>Icon</div>
				<div className={clsx(styles["header-right"])}>Avatar</div>
			</div>
		</header>
	);
};

export default Header;
