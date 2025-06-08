import clsx from "clsx";

import styles from "./Badge.module.scss";

interface BadgeProps {
	children?: React.ReactNode;
	position?:
		| "top-right"
		| "top-left"
		| "bottom-right"
		| "bottom-left"
		| "center"
		| "default";
	className?: string;
	isAgeRating?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
	children,
	className,
	position = "default",
	isAgeRating = false,
}) => {
	let ageRatingClass = "";
	if (isAgeRating && children) {
		const ageValue = String(children).toUpperCase();

		if (ageValue === "P") {
			ageRatingClass = styles.ageP;
		} else if (ageValue === "K") {
			ageRatingClass = styles.ageK;
		} else if (ageValue === "T13") {
			ageRatingClass = styles.ageC13;
		} else if (ageValue === "T16") {
			ageRatingClass = styles.ageC16;
		} else if (ageValue === "T18") {
			ageRatingClass = styles.ageC18;
		}
	}

	const badgeClasses = clsx(styles.badge, ageRatingClass, className);

	return (
		<div className={clsx(styles["wrapper"], { [styles[position]]: position })}>
			<span className={badgeClasses}>{children}</span>
		</div>
	);
};

export default Badge;
