import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks";
import { Loading } from "@/components";

const ProtectedAdminRoute = ({ children }: { children: ReactElement }) => {
	const { isLoggedIn, user, loading, setIsLoginOpen, LoginModalComponent } =
		useAuth();

	if (loading) {
		return <Loading absolute />;
	}

	if (!isLoggedIn) {
		setIsLoginOpen(true);
		return <LoginModalComponent />;
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
