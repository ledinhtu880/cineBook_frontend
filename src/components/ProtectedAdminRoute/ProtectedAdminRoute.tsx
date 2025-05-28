import { ReactElement, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks";
import { Loading } from "@/components";

const ProtectedAdminRoute = ({ children }: { children: ReactElement }) => {
	const { isLoggedIn, user, loading, setIsLoginOpen, renderLoginModals } =
		useAuth();

	useEffect(() => {
		if (!loading && !isLoggedIn) {
			setIsLoginOpen(true);
		}
	}, [loading, isLoggedIn, setIsLoginOpen]);

	useEffect(() => {
		console.log("Auth state:", { isLoggedIn, loading, user });
	}, [isLoggedIn, loading, user]);

	if (loading) {
		return <Loading absolute />;
	}

	if (!isLoggedIn) {
		return renderLoginModals(false);
	}

	// Check if user data is still being loaded even though isLoggedIn is true
	if (isLoggedIn && !user) {
		console.log("User is logged in but user data is not available yet");
		return <Loading absolute />;
	}

	// Specific check for admin role
	if (!user?.role) {
		console.log("User role check failed:", user);
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

	return children;
};

export default ProtectedAdminRoute;
