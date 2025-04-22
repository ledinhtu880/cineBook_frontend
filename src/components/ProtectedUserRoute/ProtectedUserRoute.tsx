import { useReducer, useEffect, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components";
import { authService } from "@/services/";

type State = {
	isAuthenticated: boolean;
	loading: boolean;
};

type Action =
	| { type: "AUTH_START" }
	| { type: "AUTH_SUCCESS" }
	| { type: "AUTH_FAILURE" };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "AUTH_START":
			return { ...state, loading: true };
		case "AUTH_SUCCESS":
			return { loading: false, isAuthenticated: true };
		case "AUTH_FAILURE":
			return { loading: false, isAuthenticated: false };
		default:
			return state;
	}
};

const initialState: State = {
	isAuthenticated: false,
	loading: true,
};

const ProtectedUserRoute = ({ children }: { children: ReactElement }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const checkAuth = async () => {
		dispatch({ type: "AUTH_START" });

		try {
			if (!authService.isLoggedIn()) {
				dispatch({ type: "AUTH_FAILURE" });
				return;
			}

			const userData = await authService.getCurrentUser();

			if (userData) {
				dispatch({ type: "AUTH_SUCCESS" });
			} else {
				dispatch({ type: "AUTH_FAILURE" });
			}
		} catch (error) {
			console.error("Authentication check failed:", error);
			dispatch({ type: "AUTH_FAILURE" });
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	if (state.loading) {
		return <Loading absolute />;
	}

	if (!state.isAuthenticated) {
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
