import clsx from "clsx";
import { Link } from "react-router-dom";
import { ReactNode, MouseEvent, ElementType } from "react";

import styles from "./Button.module.scss";
interface ButtonProps {
	to?: string;
	href?: string;
	primary?: boolean;
	outline?: boolean;
	text?: boolean;
	rounded?: boolean;
	disabled?: boolean;
	size?: "no-padding" | "extra-small" | "small" | "medium" | "large";
	children: ReactNode;
	className?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
	to,
	href,
	primary = false,
	outline = false,
	text = false,
	rounded = false,
	size = "medium",
	children,
	className,
	leftIcon,
	rightIcon,
	onClick,
	...passProps
}) => {
	let Comp: ElementType = "button";
	const props: Omit<ButtonProps, "children"> = {
		onClick,
		...passProps,
	};

	if (to) {
		Comp = Link;
		props.to = to;
	} else if (href) {
		Comp = "a";
		props.href = href;
	}

	const classes = clsx(
		styles.wrapper,
		{
			[styles.primary]: primary,
			[styles.outline]: outline,
			[styles.text]: text,
			[styles.rounded]: rounded,
			[styles[size]]: size,
		},
		className
	);

	return (
		<Comp className={classes} {...props}>
			{leftIcon && <span className={styles.icon}>{leftIcon}</span>}
			<span className={styles.title}>{children}</span>
			{rightIcon && <span className={styles.icon}>{rightIcon}</span>}
		</Comp>
	);
};

export default Button;
