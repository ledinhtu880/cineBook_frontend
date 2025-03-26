import clsx from "clsx";
import Header from "@layouts/components/Header";

interface DefaultLayoutProps {
	children: React.ReactNode;
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
