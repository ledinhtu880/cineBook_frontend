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
			ageRatingClass = styles.ageP; // Mọi tuổi
		} else if (ageValue === "K") {
			ageRatingClass = styles.ageK; // Dưới 13 tuổi với điều kiện có bố mẹ xem cùng
		} else if (ageValue === "T13") {
			ageRatingClass = styles.ageC13; //  Phim dành cho người từ 13 tuổi trở lên
		} else if (ageValue === "T16") {
			ageRatingClass = styles.ageC16; // Phim dành cho người từ 16 tuổi trở lên
		} else if (ageValue === "T18") {
			ageRatingClass = styles.ageC18; // Phim dành cho người từ 18 tuổi trở lên
		}
	}

	// Sửa lại cách tạo classes
	const badgeClasses = clsx(styles.badge, ageRatingClass, className);

	return (
		<div className={clsx(styles["wrapper"], { [styles[position]]: position })}>
			<span className={badgeClasses}>{children}</span>
		</div>
	);
};

export default Badge;
