import { useState, useLayoutEffect, useCallback } from "react";
import clsx from "clsx";

import config from "@config/index";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import authService from "@/services/authService";
import styles from "./Header.module.scss";
import { ApiError, ValidationErrors } from "@/types";

const Header = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("user") ? true : false
	);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});

	useLayoutEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogin = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setErrors({});

			try {
				await authService.login(email, password);
				setIsLoggedIn(true);
				setIsLoginOpen(false);
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.response?.data?.errors) {
					const validationErrors = Object.entries(
						apiError.response.data.errors
					).reduce(
						(acc, [key, messages]) => ({
							...acc,
							[key]: Array.isArray(messages) ? messages[0] : messages,
						}),
						{} as ValidationErrors
					);
					setErrors(validationErrors);
				} else {
					setErrors({ general: "Có lỗi xảy ra khi đăng nhập" });
				}
			}
		},
		[email, password]
	); // Chỉ tạo lại function khi email hoặc password thay đổi

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
					<Modal
						isOpen={isLoginOpen}
						onClose={() => setIsLoginOpen(false)}
						title="Đăng nhập"
					>
						<form
							className={clsx(styles["form-wrapper"])}
							onSubmit={handleLogin}
						>
							<Input
								label="Email"
								id="email"
								type="email"
								placeholder="Nhập email"
								error={errors.email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								label="Mật khẩu"
								id="password"
								type="password"
								placeholder="Nhập mật khẩu"
								error={errors.password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button className={clsx(styles["btn-login"])}>Đăng nhập</Button>
						</form>
					</Modal>

					<Modal
						isOpen={isRegisterOpen}
						onClose={() => setIsRegisterOpen(false)}
						title="Đăng ký"
					>
						<form>
							<input type="text" placeholder="Họ" />
							<input type="text" placeholder="Tên" />
							<input type="email" placeholder="Email" />
							<input type="password" placeholder="Mật khẩu" />
							<input type="password" placeholder="Xác nhận mật khẩu" />
							<Button primary>Đăng ký</Button>
						</form>
					</Modal>
				</>
			)}
		</header>
	);
};

export default Header;
