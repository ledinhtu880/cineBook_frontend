import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components";
import { useAuth } from "@/hooks/";

const ProtectedUserRoute = ({ children }: { children: ReactElement }) => {
	const { isLoggedIn, loading, setIsLoginOpen } = useAuth();

	if (loading) {
		return <Loading absolute />;
	}

	if (!isLoggedIn) {
		setIsLoginOpen(true);

		return (
			<Navigate
				to="/"
				state={{
					message: "Bạn phải đăng nhập mới có thể vào được đây!",
					severity: "error",
				}}
				replace
			/>
		);
	}

	return children;
};

export default ProtectedUserRoute;
