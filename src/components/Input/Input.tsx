import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Input.module.scss";
import Label from "@/components/Label/index";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	type?: string;
	label?: string;
	className?: string;
	id?: string;
	error?: string;
}

const Input: React.FC<InputProps> = ({
	type = "text",
	label,
	className,
	id,
	error,
	...passProps
}) => {
	const classes = clsx(styles["form-input"], className);

	return (
		<div>
			{label && id && <Label htmlFor={id}>{label}</Label>}{" "}
			<input className={classes} type={type} {...passProps} id={id} />
			{error && <span className={clsx(styles["error-message"])}>{error}</span>}
		</div>
	);
};

export default Input;
