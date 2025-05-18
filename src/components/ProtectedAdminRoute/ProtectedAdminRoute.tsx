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

	if (loading) {
		return <Loading absolute />;
	}

	if (!isLoggedIn) {
		return renderLoginModals(false);
	}

	if (!user?.role) {
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
