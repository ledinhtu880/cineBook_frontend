import React, { InputHTMLAttributes, useRef, useState } from "react";
import clsx from "clsx";

import styles from "./Input.module.scss";
import { Label } from "@/components";

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
	onChange,
	value,
	...passProps
}) => {
	const classes = clsx(styles["form-input"], className);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState<string>("");

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFileName(e.target.files[0].name);
		} else {
			setFileName("");
		}

		// Gọi onChange nếu được truyền vào
		if (onChange) {
			onChange(e);
		}
	};

	// Render input file tùy chỉnh
	if (type === "file") {
		return (
			<div className={styles["wrapper"]}>
				{label && id && <Label htmlFor={id}>{label}</Label>}
				<div className={styles["input-wrapper"]}>
					<input
						ref={fileInputRef}
						type="file"
						id={id}
						className={styles["hidden-input"]}
						onChange={handleFileInputChange}
						{...passProps}
					/>
					<input
						type="text"
						className={classes}
						value={fileName}
						placeholder="Chưa chọn file nào"
						readOnly
						onClick={() => fileInputRef.current?.click()}
					/>
				</div>
				{error && (
					<span className={clsx(styles["error-message"])}>{error}</span>
				)}
			</div>
		);
	}

	// Render input thông thường
	return (
		<div className={styles["wrapper"]}>
			{label && id && <Label htmlFor={id}>{label}</Label>}{" "}
			<input
				className={classes}
				type={type}
				onChange={onChange}
				value={value}
				{...passProps}
				id={id}
			/>
			{error && <span className={clsx(styles["error-message"])}>{error}</span>}
		</div>
	);
};

export default Input;
