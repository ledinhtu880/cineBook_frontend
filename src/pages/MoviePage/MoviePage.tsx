import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	PlayArrow,
	AccessTime,
	CalendarToday,
	Star,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./MoviePage.module.scss";
import MovieItem from "./MovieItem";
import { getYoutubeEmbedUrl } from "@/utils";
import { MovieProps } from "@/types";
import { movieService } from "@/services";
import { Loading, Image, Modal, Box, Button } from "@/components";

const Movie = () => {
	const { slug } = useParams();
	const [movie, setMovie] = useState<MovieProps | null>(null);
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [showTrailer, setShowTrailer] = useState(false);

	const handleOpenTrailer = () => setShowTrailer(true);
	const handleCloseTrailer = () => setShowTrailer(false);

	useEffect(() => {
		(async () => {
			try {
				if (!slug) return;
				const response = await movieService.getMovieBySlug(slug);
				setMovie(response);
			} catch (error) {
				console.error("Error fetching movie details:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, [slug]);

	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getNowShowingMovies({
					limit: 3,
					sort: "rating",
					order: "desc",
				});
				setMovies(response);
			} catch (error) {
				console.error("Error fetching movies:", error);
			}
		})();
	}, []);

	if (loading) {
		return <Loading />;
	}

	if (!movie) {
		return <div>Không tìm thấy phim</div>;
	}

	return (
		<div className={clsx(styles["wrapper"])}>
			<div className={clsx(styles["banner-wrapper"])}>
				<div className="relative h-[500px]">
					<Image
						className={clsx(styles["image"])}
						src={movie.banner_url}
						alt={movie.title}
					/>
					<div className={clsx(styles["overlay"])} />
					<div className={clsx(styles["trailer-button"])}>
						<button
							className={clsx(styles["trailer-icon"])}
							onClick={handleOpenTrailer}
						>
							<PlayArrow />
						</button>
					</div>
				</div>
			</div>

			<div className={clsx(styles["content-wrapper"])}>
				<div className={clsx(styles["content"])}>
					<div className={clsx(styles["main-info"])}>
						<div className={clsx(styles["poster-wrapper"])}>
							<Image
								src={movie.poster_url}
								alt={movie.title}
								className={clsx(styles["poster"])}
							/>
						</div>
						<div className={clsx(styles["movie-wrapper"])}>
							<div className={clsx(styles["movie-info"])}>
								<h1 className={clsx(styles["movie-title"])}>
									{movie.title}
									<span className={clsx(styles["movie-badge"])}>
										{movie.age_rating}
									</span>
								</h1>
								<div className={clsx(styles["meta-wrapper"])}>
									<div className={clsx(styles["meta-item"])}>
										<AccessTime className="text-primary" />
										<span>{movie.duration} phút</span>
									</div>
									<div className={clsx(styles["meta-item"])}>
										<CalendarToday className="text-primary" />
										<span>{movie.release_date_label}</span>
									</div>
									<div className={clsx(styles["meta-item"])}>
										<Star className="text-primary" />
										<span>{movie.rating}</span>
									</div>
								</div>
								<div className={clsx(styles["meta-item"])}>
									<span className={clsx(styles["meta-label"])}>Quốc gia:</span>
									<span>{movie.country}</span>
								</div>
								<div className={clsx(styles["meta-item"])}>
									<span className={clsx(styles["meta-label"])}>Ngôn ngữ:</span>
									<span>Phụ đề</span>
								</div>

								<div className={clsx(styles["meta-item"])}>
									<span className={clsx(styles["meta-label"])}>Thể loại:</span>
									<ul className={clsx(styles["genre-list"])}>
										{movie.genres.split(",").map((genre, index) => (
											<li key={index}>
												<a className={clsx(styles["genre-item"])}>{genre}</a>
											</li>
										))}
									</ul>
								</div>
							</div>
							<div>
								<Button primary className={clsx(styles["action-btn"])}>
									Đặt vé ngay
								</Button>
							</div>
						</div>
					</div>

					<div className={clsx(styles["description"])}>
						<h2>Nội dung phim</h2>
						{movie.description?.split("\n").map((text, index) => (
							<p key={index}>{text}</p>
						))}
					</div>
				</div>

				<div className={clsx(styles["section"])}>
					<h2 className={clsx(styles["section-title"])}>Phim đang chiếu</h2>

					<div className={clsx(styles["movie-list"])}>
						{movies.map((movie) => (
							<MovieItem key={movie.id} movie={movie} />
						))}
					</div>
				</div>
			</div>

			{showTrailer && (
				<Modal
					isOpen={showTrailer}
					onClose={handleCloseTrailer}
					aria-labelledby="movie-trailer"
					width={1000}
					height={563}
				>
					<Box>
						<iframe
							src={getYoutubeEmbedUrl(movie.trailer_url)}
							title={`${movie.title} Trailer`}
							width="100%"
							height="100%"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</Box>
				</Modal>
			)}
		</div>
	);
};

export default Movie;
