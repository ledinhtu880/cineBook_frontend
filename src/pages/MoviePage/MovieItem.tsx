import { Link, useNavigate } from "react-router-dom";
import { Star, ConfirmationNumber } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./MoviePage.module.scss";
import config from "@/config";
import { MovieProps } from "@/types/index";
import { Badge, Button, Image } from "@/components";

const MovieItem = ({ movie }: { movie: MovieProps }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(config.routes.movie_shows.replace(":slug", String(movie.slug)));
	};

	return (
		<div className={clsx(styles["movie-item"])}>
			<div className={clsx(styles["movie-container"])} onClick={handleClick}>
				<Image
					src={movie.banner_url}
					alt={movie.title}
					className={clsx(styles["movie-image"])}
				/>
				<Badge position="bottom-right" isAgeRating>
					{movie.age_rating}
				</Badge>
				<div className={clsx(styles["movie-vote"])}>
					<span>
						<Star sx={{ color: "#FDE047", fontSize: "14px" }} />
						{movie.rating}
					</span>
				</div>
				<div className={clsx(styles["movie-overlay"])}>
					<Button primary leftIcon={<ConfirmationNumber />}>
						Mua vé
					</Button>
				</div>
			</div>
			<Link
				className={clsx(styles["movie-item-title"])}
				to={config.routes.movie_shows.replace(":slug", String(movie.slug))}
			>
				{movie.title}
			</Link>
		</div>
	);
};

export default MovieItem;
