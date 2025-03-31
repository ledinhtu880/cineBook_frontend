import Header from "@layouts/components/Header";

interface DefaultLayoutProps {
	children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
	return (
		<>
			<Header />

			<section>{children}</section>
		</>
	);
}

export default DefaultLayout;
