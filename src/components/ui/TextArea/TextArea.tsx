import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./TextArea.module.scss";
import { Label } from "@/components";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	className?: string;
	id?: string;
	error?: string;
}

const TextArea: React.FC<InputProps> = ({
	label,
	className,
	id,
	error,
	value,
	...passProps
}) => {
	const classes = clsx(styles["form-input"], className);

	// Render input thông thường
	return (
		<div className={clsx(styles["wrapper"])}>
			{label && id && <Label htmlFor={id}>{label}</Label>}
			<textarea className={classes} {...passProps} id={id}>
				{value}
			</textarea>
			{error && <span className={clsx(styles["error-message"])}>{error}</span>}
		</div>
	);
};

export default TextArea;
