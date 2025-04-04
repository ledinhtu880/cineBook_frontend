import { useLocation, matchPath } from "react-router-dom";
import { useEffect } from "react";

import Header from "@layouts/components/Header";
import { publicRoutes } from "@routes/index";

interface DefaultLayoutProps {
	children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
	const location = useLocation();

	useEffect(() => {
		// Tìm route phù hợp bằng cách sử dụng matchPath
		const matchedRoute = publicRoutes.find((route) => {
			// Sử dụng matchPath để kiểm tra cả route tĩnh và động
			return matchPath(route.path, location.pathname) !== null;
		});

		if (matchedRoute && matchedRoute.title) {
			document.title = matchedRoute.title;
		} else {
			document.title = "Admin Panel | Cinema";
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
