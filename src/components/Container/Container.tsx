import clsx from "clsx";

import styles from "./Container.module.scss";
const Container = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <div className={clsx(styles["wrapper"], className)}>{children}</div>;
};

export default Container;
