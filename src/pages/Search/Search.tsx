import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	FilterAlt,
	PlayArrow,
	Search as SearchIcon,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Search.module.scss";
import { getYoutubeEmbedUrl } from "@/utils";
import type { MovieProps, GenreProps } from "@/types";
import { movieService, genreService } from "@/services";
import {
	Badge,
	Box,
	Button,
	Container,
	Input,
	Image,
	Loading,
	Modal,
} from "@/components";

const Search = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const [searchValue, setSearchValue] = useState(
		searchParams.get("q") || searchParams.get("q") || ""
	);

	const [loading, setLoading] = useState(true);
	const [showTrailer, setShowTrailer] = useState(false);
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [genres, setGenres] = useState<GenreProps[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<GenreProps[]>([]);

	useEffect(() => {
		(async () => {
			setLoading(true);

			try {
				const genresResponse = await genreService.get();
				setGenres(genresResponse);

				const keyword = searchParams.get("q") || "";
				const genreSlugs = searchParams.getAll("g") || [];

				setSearchValue(keyword);

				const newSelectedGenres = genresResponse.filter((genre: GenreProps) =>
					genreSlugs.includes(genre.slug)
				);
				setSelectedGenres(newSelectedGenres);

				const moviesResponse = await movieService.search({
					q: keyword,
					g: genreSlugs,
				});
				setMovies(moviesResponse);
			} catch (error) {
				console.error("Có lỗi xảy ra khi tải dữ liệu:", error);
				setMovies([]);
			} finally {
				setLoading(false);
			}
		})();
	}, [searchParams]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateSearchParams();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const updateSearchParams = () => {
		const newParams = new URLSearchParams();

		if (searchValue) {
			newParams.set("q", searchValue);
		}

		if (selectedGenres.length) {
			selectedGenres.map((genre) => {
				newParams.append("g", genre.slug.toString());
			});
		}

		setSearchParams(newParams);
	};

	const handleGenreSelect = (selectedGenre: GenreProps) => {
		const isSelected = selectedGenres.some(
			(genre) => genre.id === selectedGenre.id
		);

		if (isSelected) {
			setSelectedGenres(
				selectedGenres.filter((genre) => genre.id !== selectedGenre.id)
			);
		} else {
			setSelectedGenres([...selectedGenres, selectedGenre]);
		}
	};

	const handleOpenTrailer = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowTrailer(true);
	};

	const handleCloseTrailer = () => setShowTrailer(false);

	const applyGenreFilters = () => {
		updateSearchParams();
	};

	return (
		<Container className={clsx(styles["wrapper"])}>
			{/* Start: Search Header */}
			<header className={clsx(styles["header"])}>
				<form onSubmit={handleSearch} className={clsx(styles["search-form"])}>
					<Input
						type="text"
						placeholder="Tìm kiếm phim..."
						value={searchValue}
						onChange={handleChange}
						className={clsx(styles["search-input"])}
					/>
					<button type="submit" className={clsx(styles["search-input-btn"])}>
						<SearchIcon />
					</button>
				</form>
			</header>
			{/* End: Search Header */}

			{/* Start: Search Content */}
			<div className={clsx(styles["content"])}>
				{/* Filter Section */}
				<div className={clsx(styles["filter-container"])}>
					<div className={clsx(styles["filter"])}>
						<div className={clsx(styles["filter-header"])}>
							<FilterAlt />
							<span>Bộ lọc tìm kiếm</span>
						</div>

						{/* Genres */}
						<div>
							<h3 className={clsx(styles["filter-title"])}>Thể loại</h3>
							<ul className={clsx(styles["filter-list"])}>
								{genres.map((genre) => (
									<li key={genre.id} className={clsx(styles["filter-item"])}>
										<input
											type="checkbox"
											id={`genre-${genre.id}`}
											className={clsx(styles["filter-checkbox"])}
											checked={selectedGenres.some((g) => g.id === genre.id)}
											onChange={() => handleGenreSelect(genre)}
										/>
										<label
											className={clsx(styles["filter-label"])}
											htmlFor={`genre-${genre.id}`}
										>
											{genre.name}
										</label>
									</li>
								))}
							</ul>
							<Button
								onClick={applyGenreFilters}
								className={clsx(styles["btn-apply"])}
							>
								Áp dụng bộ lọc
							</Button>
						</div>
					</div>
				</div>

				{/* Results Section */}
				<div className={clsx(styles["results-container"])}>
					{searchParams.get("q") && (
						<h1 className={clsx(styles["results-title"])}>
							Kết quả tìm kiếm cho
							<strong className="text-primary">
								&nbsp;&quot;{searchParams.get("q")}&quot;
							</strong>
						</h1>
					)}

					<ul className={clsx(styles["movie-list"])}>
						{loading ? (
							<Loading />
						) : movies.length > 0 ? (
							movies.map((movie) => (
								<div key={movie.id} className={clsx(styles["movie-item"])}>
									{/* Movie Poster */}
									<div className={clsx(styles["movie-poster"])}>
										<Image
											src={movie.poster_url || "/placeholder.svg"}
											alt={movie.title}
										/>
									</div>

									{/* Movie Details */}
									<div className={clsx(styles["movie-container"])}>
										<div className={clsx(styles["movie-details"])}>
											<div>
												<h2 className={clsx(styles["movie-title"])}>
													{movie.title}
												</h2>
												<div className={clsx(styles["movie-meta"])}>
													<Badge className={clsx(styles["movie-age-rating"])}>
														{movie.age_rating}
													</Badge>
													<span className={clsx(styles["movie-duration"])}>
														{movie.duration_label}
													</span>
												</div>
												<p className={clsx(styles["movie-description"])}>
													{movie.description}
												</p>

												{/* Genres */}
												<div className={clsx(styles["movie-genres"])}>
													{movie.genres.map((genre) => (
														<Badge
															key={genre.id}
															className="border-gray-800 text-gray-700 border p-1"
														>
															{genre.name.trim()}
														</Badge>
													))}
												</div>

												<p className={clsx(styles["movie-release-date"])}>
													<span>Ngày chiếu:&nbsp;</span>
													{movie.release_date_label}
												</p>
											</div>

											{/* Actions */}
											<div className={clsx(styles["movie-actions"])}>
												<Button
													outline
													leftIcon={<PlayArrow />}
													size="small"
													onClick={handleOpenTrailer}
												>
													<span>Xem Trailer</span>
												</Button>
												<Button
													primary
													onClick={() =>
														navigate(`/phim/${movie.slug || movie.id}`)
													}
												>
													{movie.is_now_showing
														? "Đặt vé"
														: "Xem thông tin phim"}
												</Button>

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
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-10">
								<p className="text-gray-500">Không tìm thấy kết quả phù hợp</p>
							</div>
						)}
					</ul>
				</div>
			</div>
			{/* End: Search Content */}
		</Container>
	);
};

export default Search;
