import clsx from "clsx";

import styles from "./StatCard.module.scss";

const StatCard = ({ label, value }: { label: string; value: number }) => (
	<div className={styles["info-card"]}>
		<span className={styles["info-value"]}>{value}</span>
		<span className={styles["info-label"]}>{label}</span>
	</div>
);

export default StatCard;
