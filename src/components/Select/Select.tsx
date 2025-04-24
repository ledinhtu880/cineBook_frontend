import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Select.module.scss";
import { Label } from "@/components";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
	children?: React.ReactNode[] | React.ReactNode;
	label?: string;
	className?: string;
	id?: string;
	error?: string;
	arrow?: boolean;
}

const Input: React.FC<SelectProps> = ({
	children,
	label,
	className,
	id,
	error,
	arrow = false,
	...passProps
}) => {
	const classes = clsx(
		styles["form-input"],
		{
			[styles["arrow-hidden"]]: arrow,
		},
		className
	);

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
