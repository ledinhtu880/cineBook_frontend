import clsx from "clsx";

import styles from "./PageWrapper.module.scss";
import Breadcrumb from "@components/Breadcrumb";

interface PageWrapper {
	title: string;
	children: React.ReactNode;
}

const PageWrapper = ({ title, children }: PageWrapper) => {
	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles.header)}>
				<h4 className={clsx(styles.title)}>{title}</h4>

				<div className={clsx(styles.breadcrumb)}>
					<Breadcrumb />
				</div>
			</div>
			{children}
		</div>
	);
};

export default PageWrapper;
