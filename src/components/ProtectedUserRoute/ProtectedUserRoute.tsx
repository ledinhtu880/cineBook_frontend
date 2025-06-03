import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";

const ProtectedUserRoute = ({ children }: { children: ReactElement }) => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
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
