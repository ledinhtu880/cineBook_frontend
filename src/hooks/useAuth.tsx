import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services";
import { useNavigate } from "react-router-dom";
import {
	LoginModal,
	RegisterModal,
	RegisterSuccessModal,
} from "@/components/auth/";
import type { UserProps } from "@/types";

export const useAuth = () => {
	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("token") ? true : false
	);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isRegisterSuccessOpen, setIsRegisterSuccessOpen] = useState(false);
	const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
		null
	);

	const [user, setUser] = useState<UserProps | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchCurrentUser = useCallback(async () => {
		if (isLoggedIn) {
			try {
				setLoading(true);
				const userData = await authService.getCurrentUser();
				if (userData) {
					setUser(userData);
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setLoading(false);
			}
		} else {
			setUser(null);
			setLoading(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCurrentUser();
	}, [isLoggedIn, fetchCurrentUser]);

	const handleLoginSuccess = useCallback(() => {
		setIsLoginOpen(false);
		setIsLoggedIn(true);

		if (pendingCallback) {
			pendingCallback();
			setPendingCallback(null);
		}
	}, [pendingCallback]);

	const handleLogout = useCallback(() => {
		authService.logout();
		setIsLoggedIn(false);
		setUser(null);
		navigate("/", {
			state: {
				message: "Bạn đã đăng xuất khỏi hệ thống",
				severity: "info",
			},
		});

		window.location.reload();
	}, [navigate]);

	// Chuyển từ form đăng nhập sang đăng ký
	const switchToRegister = useCallback(() => {
		setIsLoginOpen(false);
		setIsRegisterOpen(true);
	}, []);

	// Chuyển từ form đăng ký sang đăng nhập
	const switchToLogin = useCallback(() => {
		setIsRegisterOpen(false);
		setIsLoginOpen(true);
	}, []);

	// Xử lý đăng ký thành công
	const handleRegisterSuccess = useCallback(() => {
		setIsRegisterOpen(false);
		setIsRegisterSuccessOpen(true);
	}, []);

	// Đóng modal đăng ký thành công và cập nhật trạng thái đăng nhập
	const handleRegisterSuccessClose = useCallback(() => {
		setIsRegisterSuccessOpen(false);
		setIsLoggedIn(true);
	}, []);

	// Kiểm tra đăng nhập và thực thi callback
	const checkAuthAndExecute = useCallback(
		(callback: () => void) => {
			if (isLoggedIn) {
				callback();
			} else {
				setPendingCallback(() => callback);
				setIsLoginOpen(true);
			}
		},
		[isLoggedIn]
	);

	// Trả về JSX cho LoginModal
	const renderLoginModals = useCallback(
		(isHaveRegister = true) => (
			<>
				{isHaveRegister ? (
					<>
						<LoginModal
							isOpen={isLoginOpen}
							onClose={() => setIsLoginOpen(false)}
							onLoginSuccess={handleLoginSuccess}
							onOpenRegister={switchToRegister}
						/>
						<RegisterModal
							isOpen={isRegisterOpen}
							onClose={() => setIsRegisterOpen(false)}
							onOpenLogin={switchToLogin}
							onRegisterSuccess={handleRegisterSuccess}
						/>
						<RegisterSuccessModal
							isOpen={isRegisterSuccessOpen}
							onClose={() => setIsRegisterSuccessOpen(false)}
							onRegisterSuccess={handleRegisterSuccessClose}
						/>
					</>
				) : (
					<LoginModal
						isOpen={isLoginOpen}
						onClose={() => setIsLoginOpen(false)}
						onLoginSuccess={handleLoginSuccess}
						isHaveRegister={false}
					/>
				)}
			</>
		),
		[
			isLoginOpen,
			isRegisterOpen,
			isRegisterSuccessOpen,
			handleLoginSuccess,
			switchToRegister,
			switchToLogin,
			handleRegisterSuccess,
			handleRegisterSuccessClose,
		]
	);

	return {
		isLoggedIn,
		isLoginOpen,
		isRegisterOpen,
		isRegisterSuccessOpen,
		setIsLoginOpen,
		setIsRegisterOpen,
		setIsRegisterSuccessOpen,
		handleLoginSuccess,
		handleLogout,
		switchToRegister,
		switchToLogin,
		handleRegisterSuccess,
		handleRegisterSuccessClose,
		checkAuthAndExecute,
		renderLoginModals,
		user,
		loading,
		fetchCurrentUser,
	};
};
