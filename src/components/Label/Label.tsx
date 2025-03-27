import { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Label.module.scss";

interface LabelProps {
	htmlFor: string;
	children: ReactNode;
	className?: string;
}

const Label = ({ htmlFor, children, className }: LabelProps) => {
	return (
		<label htmlFor={htmlFor} className={clsx(styles.label, className)}>
			{children}
		</label>
	);
};

export default Label;
