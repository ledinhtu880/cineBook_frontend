import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { useEffect } from "react";

import { publicRoutes } from "@/routes";
import { LocationState } from "@/types";
import { useSnackbar } from "@/context";
import Header from "@/layouts/components/Header";

function DefaultLayout({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();
	const state = location.state as LocationState;
	const { showSnackbar } = useSnackbar();

	useEffect(() => {
		if (state?.message) {
			showSnackbar(state.message, state.severity);
			// Clear state sau khi đã show message
			navigate(location.pathname, { replace: true });
		}
	}, [showSnackbar, state, navigate, location.pathname]);

	useEffect(() => {
		const matchedRoute = publicRoutes.find((route) => {
			return matchPath(route.path, location.pathname) !== null;
		});

		if (matchedRoute && matchedRoute.title) {
			document.title = matchedRoute.title;
		}
	}, [location]);

	return (
		<>
			<Header />

			<section>{children}</section>
		</>
	);
}

export default DefaultLayout;
