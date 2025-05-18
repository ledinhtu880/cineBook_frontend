import { memo } from "react";
import clsx from "clsx";

import styles from "./MovieItem.module.scss";
import type { MovieProps } from "@/types";
import { Badge, Button, Image, Tooltip } from "@/components";
interface MovieCardProps {
	movie: MovieProps;
	onClick?: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
	console.log(movie.genres_list);

	return (
		<div className={clsx(styles.card)} onClick={onClick}>
			<div className={clsx(styles.poster)}>
				<Image
					className={clsx(styles.image)}
					src={movie.poster_url}
					alt={movie.title}
				/>
				<Badge isAgeRating position="bottom-right">
					{movie.age_rating}
				</Badge>
			</div>
			<div className={clsx(styles.info)}>
				<h3 className={clsx(styles.title, "line-clamp-2")}>{movie.title}</h3>
				<div className={clsx(styles.text)}>
					Thời gian: {movie.duration_label}
				</div>
				<Tooltip title={movie.genres_list} arrow placement="bottom">
					<p className={clsx(styles.text)}>Thể loại: {movie?.genres_list}</p>
				</Tooltip>
			</div>
			<Button primary>Xem chi tiết</Button>
		</div>
	);
};

export default memo(MovieCard);
