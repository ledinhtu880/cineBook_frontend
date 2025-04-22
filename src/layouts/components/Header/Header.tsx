import { Link } from "react-router-dom";
import clsx from "clsx";

import styles from "./Header.module.scss";
import config from "@/config";
import images from "@/assets/images";
import { useAuth } from "@/hooks"; // Import hook
import { Button, Image, Container } from "@/components";

const Header = () => {
	const {
		isLoggedIn,
		setIsLoginOpen,
		setIsRegisterOpen,
		handleLogout,
		LoginModalComponent,
	} = useAuth();

	return (
		<>
			<header className={clsx(styles["header-languages"])}>
				<Container className={clsx(styles["wrapper"])}>
					{isLoggedIn ? (
						<Button
							className={clsx(styles.button, styles["btn-sm"])}
							text
							size="no-padding"
							onClick={handleLogout}
						>
							Đăng xuất
						</Button>
					) : (
						<>
							<Button
								className={clsx(styles.button, styles["btn-sm"])}
								text
								size="no-padding"
								onClick={() => setIsLoginOpen(true)}
							>
								Đăng nhập
							</Button>
							<Button
								className={clsx(styles.button, styles["btn-sm"])}
								text
								size="no-padding"
								onClick={() => setIsRegisterOpen(true)}
							>
								Đăng ký
							</Button>
						</>
					)}
				</Container>
			</header>
			<header className={clsx(styles.header)}>
				<Container>
					<nav className={clsx(styles.nav)}>
						<div className={clsx(styles["left-section"])}>
							<Link to={config.routes.home}>
								<Image
									src={images.logo}
									alt="Logo"
									className={clsx(styles.logo)}
								/>
							</Link>
						</div>
						<div className={clsx(styles["right-section"])}>
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
					</nav>
				</Container>
			</header>

			<LoginModalComponent />
		</>
	);
};

export default Header;
