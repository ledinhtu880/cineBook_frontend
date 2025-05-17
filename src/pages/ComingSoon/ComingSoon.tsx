import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MovieProps } from "@/types";
import { movieService } from "@/services";
import { MovieItem, Loading } from "@/components";
import config from "@/config";

const NowShowing = () => {
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getComingSoonMovies();
				setMovies(response);
			} catch (error) {
				console.error("Error fetching movies:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleClick = (movie: MovieProps) => {
		const path = config.routes.movie_detail.replace(
			":slug",
			String(movie.slug)
		);
		navigate(path);
	};

	if (loading) {
		return <Loading absolute />;
	}

	return <MovieItem movies={movies} handleClick={handleClick} />;
};

export default NowShowing;
