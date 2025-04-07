import { useEffect, useState } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import clsx from "clsx";

import { adminRoutes } from "@routes/index";
import styles from "./AdminLayout.module.scss";
import Header from "@/layouts/components/Admin/Header";
import Sidebar from "@/layouts/components/Admin/Sidebar";
import { LocationState } from "@/types";
import { useSnackbar } from "@/context";

interface AdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
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
		// Tìm route phù hợp bằng cách sử dụng matchPath
		const matchedRoute = adminRoutes.find((route) => {
			// Sử dụng matchPath để kiểm tra cả route tĩnh và động
			return matchPath(route.path, location.pathname) !== null;
		});

		if (matchedRoute && matchedRoute.title) {
			document.title = matchedRoute.title;
		} else {
			document.title = "Admin Panel | Cinema";
		}
	}, [location]);

	const [isCollapse, setIsCollapse] = useState(false);

	const handleToggleCollapse = () => {
		setIsCollapse(!isCollapse);
	};

	return (
		<div className={clsx(styles.wrapper)}>
			<Sidebar isCollapse={isCollapse} />
			<section className={clsx(styles["section"])}>
				<Header onCollapse={handleToggleCollapse} />
				<main className={clsx(styles["main"])}>{children}</main>
			</section>
		</div>
	);
}

export default AdminLayout;
