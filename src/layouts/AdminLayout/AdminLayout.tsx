import { useState } from "react";
import clsx from "clsx";

import styles from "./AdminLayout.module.scss";
import Sidebar from "@/layouts/components/Admin/Sidebar";
import Header from "@/layouts/components/Admin/Header";

interface AdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
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
