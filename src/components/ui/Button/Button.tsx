import { ReactNode, MouseEvent, ElementType } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

import styles from "./Button.module.scss";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

// Props chung cho cả 3 loại button
interface CommonButtonProps {
	primary?: boolean;
	outline?: boolean;
	text?: boolean;
	rounded?: boolean;
	size?: "no-padding" | "extra-small" | "small" | "medium" | "large";
	className?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	add?: boolean;
	children?: ReactNode;
}

// Props cho thẻ Link của React Router
interface LinkButtonProps extends CommonButtonProps {
	to: string;
	href?: never;
}

// Props cho thẻ anchor HTML
interface AnchorButtonProps
	extends CommonButtonProps,
		AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	to?: never;
}

// Props cho thẻ button HTML
interface NativeButtonProps
	extends CommonButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {
	to?: never;
	href?: never;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}

// Union type của tất cả loại props
type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

const Button: React.FC<ButtonProps> = ({
	to,
	href,
	primary = false,
	outline = false,
	text = false,
	rounded = false,
	size = "small",
	children,
	className,
	leftIcon,
	rightIcon,
	add = false,
	...passProps
}) => {
	let Comp: ElementType = "button";

	if (to) {
		Comp = Link;
	} else if (href) {
		Comp = "a";
	}

	const classes = clsx(
		styles.wrapper,
		{
			[styles.primary]: primary,
			[styles.outline]: outline,
			[styles.text]: text,
			[styles.rounded]: rounded,
			[styles[size]]: size,
			[styles.add]: add,
		},
		className
	);

	return (
		<Comp
			className={classes}
			{...(to ? { to } : href ? { href } : {})}
			{...passProps}
		>
			{leftIcon && <span className={clsx(styles.icon)}>{leftIcon}</span>}
			<span className={clsx(styles.title)}>{children}</span>
			{rightIcon && <span className={clsx(styles.icon)}>{rightIcon}</span>}
		</Comp>
	);
};

export default Button;
