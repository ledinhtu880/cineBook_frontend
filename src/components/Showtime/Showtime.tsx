import clsx from "clsx";

import styles from "./Showtime.module.scss";
import { MovieProps, ShowtimeProps } from "@/types";
import { Button } from "@/components";

interface Props {
	movie: MovieProps;
	showtimes: ShowtimeProps[];
	handleClick: (movie: MovieProps, showtime: ShowtimeProps) => void;
	className?: string;
	relative?: boolean;
}

const Input: React.FC<Props> = ({
	movie,
	showtimes,
	handleClick,
	className,
	relative,
}) => {
	const classes = clsx(
		styles["showtime-container"],
		{
			[styles["position"]]: relative,
		},
		className
	);

	return (
		<div className={classes}>
			<div className={clsx(styles["showtime-card"])}>
				<span className={clsx(styles["showtime-label"], "border-left-accent")}>
					Suất chiếu
				</span>
				{showtimes.length > 0 ? (
					<div className="flex gap-3">
						{showtimes.map((showtime) => (
							<Button
								key={showtime.id}
								className={clsx(styles["showtime-button"])}
								onClick={() => handleClick(movie, showtime)}
							>
								<div className={clsx(styles["showtime-time"])}>
									{showtime.start_time_formatted}
								</div>
								<div className={clsx(styles["showtime-room-label"])}>
									{showtime.room.name}
								</div>
							</Button>
						))}
					</div>
				) : (
					<h1 className="empty">Không có suất chiếu nào cho ngày này</h1>
				)}
			</div>
		</div>
	);
};

export default Input;
