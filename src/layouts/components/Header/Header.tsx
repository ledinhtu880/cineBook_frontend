import { Link } from "react-router-dom";
import { Person } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Header.module.scss";
import config from "@/config";
import { useAuth } from "@/hooks"; // Import hook
import { Button, Container } from "@/components";

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
			<header className={clsx(styles.header)}>
				<Container>
					<nav className={clsx(styles.nav)}>
						<div className={clsx(styles["left-section"])}>
							<Link to={config.routes.home} className={styles.logo}>
								🎬 CineBook
							</Link>
						</div>
						<div className={clsx(styles["mid-section"])}>
							<Button className={styles.btn} to={config.routes.now_showing}>
								Phim đang chiếu
							</Button>
							<Button className={styles.btn} to={config.routes.coming_soon}>
								Phim sắp chiếu
							</Button>
							<Button className={styles.btn} to={config.routes.cinema}>
								Hệ thống rạp
							</Button>
						</div>
						{isLoggedIn ? (
							<Button
								className={clsx(styles["btn-sm"])}
								outline
								onClick={handleLogout}
							>
								Đăng xuất
							</Button>
						) : (
							<div className={clsx(styles["right-section"])}>
								<Button
									leftIcon={<Person fontSize="small" />}
									className={clsx(styles["btn-sm"])}
									outline
									onClick={() => setIsLoginOpen(true)}
								>
									Đăng nhập
								</Button>
								<Button
									className={clsx(styles["btn-sm"])}
									primary
									onClick={() => setIsRegisterOpen(true)}
								>
									Đăng ký
								</Button>
							</div>
						)}
					</nav>
				</Container>
			</header>

			<LoginModalComponent />
		</>
	);
};

export default Header;
