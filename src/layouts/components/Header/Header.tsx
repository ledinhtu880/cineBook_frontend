import { useState, useLayoutEffect, useCallback } from "react";
import clsx from "clsx";

import styles from "./Header.module.scss";
import config from "@config/index";
import Button from "@/components/Button";
import authService from "@/services/authService";
import {
	LoginModal,
	RegisterModal,
	RegisterSuccessModal,
} from "@/components/Auth/";

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("user") ? true : false
	);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isRegisterSuccessOpen, setIsRegisterSuccessOpen] = useState(false);

	useLayoutEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLoginSuccess = useCallback(() => {
		setIsLoggedIn(true);
	}, []);

	const handleLogout = useCallback(() => {
		authService.logout();
		setIsLoggedIn(false);
	}, []);

	return (
		<header className={clsx(styles.header)}>
			<div className={clsx(styles.wrapper)}>
				<nav className={clsx(styles.nav)}>
					<div className={clsx(styles["left-section"])}>
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
					<div className={clsx(styles["right-section"])}>
						{isLoggedIn ? (
							<div className={clsx(styles.userSection)}>
								<Button
									className={clsx(styles.button)}
									text
									onClick={handleLogout}
								>
									Đăng xuất
								</Button>
							</div>
						) : (
							<>
								<Button
									className={clsx(styles.button)}
									text
									onClick={() => setIsLoginOpen(true)}
								>
									Đăng nhập
								</Button>
								<Button
									className={clsx(styles.button)}
									text
									onClick={() => setIsRegisterOpen(true)}
								>
									Đăng ký
								</Button>
							</>
						)}
					</div>
				</nav>
			</div>

			{!isLoggedIn && (
				<>
					<LoginModal
						isOpen={isLoginOpen}
						onClose={() => setIsLoginOpen(false)}
						onLoginSuccess={handleLoginSuccess}
						onOpenRegister={() => {
							setIsLoginOpen(false);
							setIsRegisterOpen(true);
						}}
					/>

					<RegisterModal
						isOpen={isRegisterOpen}
						onClose={() => setIsRegisterOpen(false)}
						onOpenLogin={() => {
							setIsLoginOpen(true);
							setIsRegisterOpen(false);
						}}
						onRegisterSuccess={() => {
							setIsRegisterOpen(false);
							setIsRegisterSuccessOpen(true);
						}}
					/>

					<RegisterSuccessModal
						isOpen={isRegisterSuccessOpen}
						onClose={() => setIsRegisterSuccessOpen(false)}
						onRegisterSuccess={() => {
							setIsRegisterSuccessOpen(false);
							setIsLoggedIn(true);
						}}
					/>
				</>
			)}
		</header>
	);
};

export default Header;
