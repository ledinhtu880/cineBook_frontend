import { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import clsx from "clsx";

import { adminRoutes } from "@routes/index";
import styles from "./AdminLayout.module.scss";
import Header from "@/layouts/components/Admin/Header";
import Sidebar from "@/layouts/components/Admin/Sidebar";

interface AdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
	const location = useLocation();

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
