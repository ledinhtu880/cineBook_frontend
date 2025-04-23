import { useState, useEffect } from "react";
import clsx from "clsx";

import styles from "./CountdownTimer.module.scss";

interface Props {
	initialTime: number;
	onTimeEnd: () => void;
	className?: string;
}

const CountdownTimer: React.FC<Props> = ({
	initialTime = 600,
	onTimeEnd,
	className,
}) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);

	useEffect(() => {
		if (timeLeft <= 0) {
			onTimeEnd();
			return;
		}

		const timer = setTimeout(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft, onTimeEnd]);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<span className={clsx(styles["timer"], className)}>
			{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
		</span>
	);
};

export default CountdownTimer;
