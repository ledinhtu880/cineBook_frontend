import clsx from "clsx";
import Header from "./../components/Header";
import { ReactNode } from "react";

interface DefaultLayoutProps {
	children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
	return (
		<div className={clsx("wrapper")}>
			<Header />

			<div className={clsx("container")}>{children}</div>
		</div>
	);
}

export default DefaultLayout;
