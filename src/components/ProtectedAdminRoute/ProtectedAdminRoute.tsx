import { Navigate } from "react-router-dom";
import { useState, useEffect, ReactElement } from "react";

import { LoginModal } from "@components/Auth/index";
import Loading from "@components/Loading";
import { authService } from "@/services/";

const ProtectedAdminRoute = ({ children }: { children: ReactElement }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showLoginModal, setShowLoginModal] = useState(false);

	const checkAuth = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setShowLoginModal(true);
				setLoading(false);
				return;
			}

			const userData = await authService.getCurrentUser();

			if (userData) {
				setIsAuthenticated(true);
				setIsAdmin(userData.role);
				setShowLoginModal(false);
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
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const handleLoginSuccess = async () => {
		checkAuth();
	};

	const handleCloseModal = () => {
		setShowLoginModal(false);
		return <Navigate to="/" replace />;
	};

	if (loading) {
		return <Loading absolute />;
	}

	// If not authenticated, show login modal but keep on current page
	if (!isAuthenticated) {
		return (
			<LoginModal
				isOpen={showLoginModal}
				onClose={handleCloseModal}
				onLoginSuccess={handleLoginSuccess}
				isHaveRegister={false}
			/>
		);
	}

	// If authenticated but not admin, redirect to home
	if (!isAdmin) {
		return (
			<Navigate
				to="/"
				state={{
					message: "Bạn không có quyền truy cập vào trang này!",
					severity: "error",
				}}
				replace
			/>
		);
	}

	// If admin, show admin content
	return children;
};

export default ProtectedAdminRoute;
