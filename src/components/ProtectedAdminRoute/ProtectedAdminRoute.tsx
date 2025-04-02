import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, ReactElement } from "react";

import { LoginModal } from "@components/Auth/index";
import Loading from "@components/Loading";
import authService from "@/services/authService";

const ProtectedAdminRoute = ({ children }: { children: ReactElement }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const location = useLocation();

	useEffect(() => {
		(async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					setShowLoginModal(true);
					setLoading(false);
					return;
				}

				// Sử dụng authService để kiểm tra người dùng hiện tại
				const userData = await authService.getCurrentUser();

				if (userData) {
					setIsAuthenticated(true);
					setIsAdmin(userData.role);
				} else {
					setIsAuthenticated(false);
					setIsAdmin(false);
					setShowLoginModal(true);
				}
			} catch (error) {
				console.error("Authentication check failed:", error);
				setIsAuthenticated(false);
				setIsAdmin(false);
				setShowLoginModal(true);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleLoginSuccess = async () => {
		setLoading(true);
		try {
			const userData = await authService.getCurrentUser();

			if (userData && userData) {
				if (userData.role) {
					setIsAuthenticated(true);
					setIsAdmin(true);
					setShowLoginModal(false);
				} else {
					setShowLoginModal(false);
					return <Navigate to="/" replace />;
				}
			}
		} catch (error) {
			console.error("Failed to get user data after login:", error);
			alert("Đã xảy ra lỗi. Vui lòng thử lại.");
		} finally {
			setLoading(false);
		}
	};

	const handleCloseModal = () => {
		setShowLoginModal(false);
		return <Navigate to="/" replace />;
	};

	if (loading) {
		return <Loading />;
	}

	// If not authenticated, show login modal but keep on current page
	if (!isAuthenticated) {
		return (
			<>
				<LoginModal
					isOpen={showLoginModal}
					onClose={handleCloseModal}
					onLoginSuccess={handleLoginSuccess}
					isHaveRegister={false}
				/>
			</>
		);
	}

	// If authenticated but not admin, redirect to home
	if (!isAdmin) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// If admin, show admin content
	return children;
};

export default ProtectedAdminRoute;
