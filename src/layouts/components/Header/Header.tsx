import clsx from "clsx";

import config from "@config/index";
import Button from "@/components/Button";
import styles from "./Header.module.scss";

const Header = () => {
	return (
		<header className={clsx(styles.header)}>
			<div className={clsx(styles.wrapper)}>
				<nav className={clsx(styles.nav)}>
					<div className={clsx(styles.leftSection)}>
						<Button className={styles.button} to={config.routes.home}>
							Trang chủ
						</Button>
						<Button className={styles.button} to={config.routes.now_showing}>
							Đang chiếu
						</Button>
						<Button className={styles.button} to={config.routes.coming_soon}>
							Sắp chiếu
						</Button>
						<Button className={styles.button} to={config.routes.cinema}>
							Hệ thống rạp
						</Button>
					</div>
					<div className={clsx(styles.rightSection)}>
						<Button className={styles.button} text>
							Đăng nhập
						</Button>
						<Button className={styles.button} text>
							Đăng ký
						</Button>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
