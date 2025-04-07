import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Select.module.scss";
import Label from "@/components/Label/index";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
	children?: React.ReactNode[] | React.ReactNode;
	label?: string;
	className?: string;
	id?: string;
	error?: string;
}

const Input: React.FC<SelectProps> = ({
	children,
	label,
	className,
	id,
	error,
	...passProps
}) => {
	const classes = clsx(styles["form-input"], className);

	return (
		<div className={styles["wrapper"]}>
			{/* Render label nếu có */}
			{label && id && <Label htmlFor={id}>{label}</Label>}{" "}
			<select className={classes} {...passProps} id={id}>
				{children}
			</select>
			{error && <span className={clsx(styles["error-message"])}>{error}</span>}
		</div>
	);
};

export default Input;
