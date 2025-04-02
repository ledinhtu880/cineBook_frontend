import clsx from "clsx";

import styles from "./AdminLayout.module.scss";
import Sidebar from "@/layouts/components/Admin/Sidebar";
import Header from "@/layouts/components/Admin/Header";

interface AdminLayoutProps {
	children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className={clsx(styles.wrapper)}>
			<Sidebar />
			<section className={clsx(styles["section"])}>
				<Header />
				<main className={clsx(styles["main"])}>{children}</main>
			</section>
		</div>
	);
}

export default AdminLayout;
