import clsx from "clsx";

import styles from "./Movie.module.scss";
import { MovieProps } from "@/types";
import { MovieCard } from "@/components";

interface Props {
	movies: MovieProps[];
	handleClick: (movie: MovieProps) => void;
}

const Movie: React.FC<Props> = ({ movies, handleClick }) => {
	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles["movie-wrapper"])}>
				{movies.map((movie) => (
					<MovieCard
						key={movie.id}
						movie={movie}
						onClick={() => handleClick(movie)}
					/>
				))}
			</div>

			{movies.length === 0 && (
				<div className={clsx(styles.empty)}>
					<p>Không có phim nào đang chiếu</p>
				</div>
			)}
		</div>
	);
};

export default Movie;
