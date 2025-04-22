import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services";
import {
	LoginModal,
	RegisterModal,
	RegisterSuccessModal,
} from "@/components/Auth/";

export const useAuth = () => {
	// States
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("token") ? true : false
	);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isRegisterSuccessOpen, setIsRegisterSuccessOpen] = useState(false);
	const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
		null
	);

	// Kiểm tra token khi component mount
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	// Xử lý đăng nhập thành công
	const handleLoginSuccess = useCallback(() => {
		setIsLoginOpen(false);
		setIsLoggedIn(true);

		// Nếu có callback đang chờ, thực hiện nó
		if (pendingCallback) {
			pendingCallback();
			setPendingCallback(null);
		}
	}, [pendingCallback]);

	// Xử lý đăng xuất
	const handleLogout = useCallback(() => {
		authService.logout();
		setIsLoggedIn(false);
	}, []);

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
				// Nếu đã đăng nhập, thực thi callback ngay lập tức
				callback();
			} else {
				// Nếu chưa đăng nhập, lưu callback để thực thi sau khi đăng nhập
				setPendingCallback(() => callback);
				setIsLoginOpen(true);
			}
		},
		[isLoggedIn]
	);

	// Trả về JSX cho LoginModal
	const LoginModalComponent = useCallback(
		() => (
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
		LoginModalComponent,
	};
};
