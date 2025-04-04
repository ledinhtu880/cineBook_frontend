import { useState, useLayoutEffect, useCallback } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";
import config from "@config/index";
import Button from "@/components/Button";
import Image from "@/components/Image";
import images from "@/assets/images";
import { authService } from "@/services/";
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
		<>
			<header className={clsx(styles["header-languages"])}>
				<div className={clsx(styles.wrapper)}>
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
						</>
					)}
				</div>
			</header>
			<header className={clsx(styles.header)}>
				<div className={clsx(styles.wrapper)}>
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
				</div>
			</header>
		</>
	);
};

export default Header;
