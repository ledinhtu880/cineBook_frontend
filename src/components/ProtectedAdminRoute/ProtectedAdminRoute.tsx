import { Navigate } from "react-router-dom";
import { useState, useEffect, ReactElement } from "react";

import { authService } from "@/services/";
import { Loading } from "@/components";
import { LoginModal } from "@/components/Auth";

const ProtectedAdminRoute = ({ children }: { children: ReactElement }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showLoginModal, setShowLoginModal] = useState(false);

	const checkAuth = async () => {
		try {
			setIsAuthenticated(false);
			setIsAdmin(false);

			if (!authService.isLoggedIn()) {
				setShowLoginModal(true);
				setLoading(false);
				return;
			}

			const userData = await authService.getCurrentUser();

			if (userData) {
				setIsAuthenticated(true);

				const isAdminRole = userData.role;

				console.log(userData);

				setIsAdmin(isAdminRole);
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
		window.location.href = "/"; // Force full page navigation
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
