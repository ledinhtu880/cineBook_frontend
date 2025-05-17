import clsx from "clsx";

import styles from "./StatCard.module.scss";

const StatCard = ({ label, value }: { label: string; value: number }) => (
	<div className={clsx(styles["info-card"])}>
		<span className={clsx(styles["info-value"])}>{value}</span>
		<span className={clsx(styles["info-label"])}>{label}</span>
	</div>
);

export default StatCard;
