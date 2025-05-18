import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";

import styles from "./DefaultLayout.module.scss";
import { publicRoutes } from "@/routes";
import type { LocationState } from "@/types";
import { useSnackbar } from "@/context";
import Header from "@/layouts/components/Header";
import Footer from "@/layouts/components/Footer";

function DefaultLayout({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();
	const state = location.state as LocationState;
	const { showSnackbar } = useSnackbar();

	useEffect(() => {
		if (state?.message) {
			showSnackbar(state.message, state.severity);
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

			<section className={clsx(styles.wrapper)}>{children}</section>

			<Footer />
		</>
	);
}

export default DefaultLayout;
