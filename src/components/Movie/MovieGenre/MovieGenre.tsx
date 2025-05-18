import clsx from "clsx";

import styles from "./MovieGenre.module.scss";
import type { GenreProps, MovieProps } from "@/types";

interface Props {
	movie: MovieProps;
	handleClick: (genre: GenreProps) => void;
}

const MovieGenre: React.FC<Props> = ({ movie, handleClick }) => {
	return (
		<ul className={clsx(styles["genre-list"])}>
			{movie.genres.map((genre: GenreProps) => (
				<li
					key={genre.id}
					className={clsx(styles["genre-item"])}
					onClick={() => handleClick(genre)}
				>
					{genre.name}
				</li>
			))}
		</ul>
	);
};

export default MovieGenre;
