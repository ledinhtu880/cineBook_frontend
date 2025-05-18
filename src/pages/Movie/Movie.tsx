import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	PlayArrow,
	AccessTime,
	CalendarToday,
	Star,
	LocationOn,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Movie.module.scss";
import config from "@/config";
import MovieItem from "./MovieItem";
import { getYoutubeEmbedUrl } from "@/utils";
import { formatDate, isToday } from "@/utils/datetime";
import {
	MovieProps,
	CityProps,
	CinemaProps,
	GenreProps,
	ShowtimeProps as ShowtimeDefaultProps,
} from "@/types";
import { useAuth } from "@/hooks";
import { movieService, cityService } from "@/services";
import {
	Badge,
	Box,
	Button,
	Loading,
	Image,
	Modal,
	Select,
	Showtime,
	Tabs,
} from "@/components";

interface ShowtimeProps extends ShowtimeDefaultProps {
	movie: {
		id: number;
		title: string;
	};
	cinema: {
		id: number;
		name: string;
	};
}

const Movie = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const { checkAuthAndExecute, LoginModalComponent } = useAuth();

	const [dates, setDates] = useState<Date[]>([]);
	const [cities, setCities] = useState<CityProps[]>([]);
	const [movie, setMovie] = useState<MovieProps | null>(null);
	const [ratedMovies, setRatedMovies] = useState<MovieProps[]>([]);
	const [showtimes, setShowtimes] = useState<ShowtimeProps[]>([]);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedCity, setSelectedCity] = useState<CityProps | null>(null);
	const [selectedCinema, setSelectedCinema] = useState<CinemaProps | null>(
		null
	);

	const [filteredShowtimes, setFilteredShowtimes] = useState<ShowtimeProps[]>(
		[]
	);

	const [showTrailer, setShowTrailer] = useState(false);
	const [showBookingModal, setShowBookingModal] = useState(false);

	useEffect(() => {
		(() => {
			const today = new Date();
			const nextDates: Date[] = [];
			for (let i = 0; i < 8; i++) {
				const newDate = new Date(today);
				newDate.setDate(today.getDate() + i);
				nextDates.push(newDate);
			}

			setDates(nextDates);
			setSelectedDate(today);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				if (!slug) return;
				const response = await movieService.getMovieBySlug(slug);
				setMovie(response);

				document.title = response.title;
			} catch (error) {
				console.error("Lỗi khi tải dữ liệu phim:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, [slug]);

	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getTopRatedNowShowingMovies({
					limit: 3,
					sort: "rating",
					order: "desc",
				});
				setRatedMovies(response);
			} catch (error) {
				console.error("Error fetching movies:", error);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await cityService.getWithCinemas();
				setCities(data);

				if (data && data.length > 0) {
					setSelectedCity(data[0]);
					setSelectedCinema(data[0].cinemas[0]);
				}
			} catch (error) {
				console.error(
					"Có lỗi xảy ra trong quá trình tải danh sách thành phố:",
					error
				);
			}
		})();
	}, []);

	useEffect(() => {
		try {
			(async () => {
				if (!movie) return;
				const data = await movieService.getShowtimese(movie.id);
				setShowtimes(data);
			})();
		} catch (error) {
			console.error(
				"Có lỗi xảy ra trong quá trình tải danh sách thành phố:",
				error
			);
		}
	}, [movie]);

	useEffect(() => {
		(async () => {
			if (!movie) return;
			if (!showtimes) return;

			const { formattedDateWithYear } = formatDate(selectedDate);

			const filtered = showtimes.filter(
				(showtime) =>
					showtime.movie.id === movie?.id &&
					showtime.cinema.id === selectedCinema?.id &&
					showtime.date == formattedDateWithYear
			);

			setFilteredShowtimes(filtered);
		})();
	}, [movie, showtimes, selectedCinema, selectedDate]);

	const handleOpenTrailer = () => setShowTrailer(true);
	const handleCloseTrailer = () => setShowTrailer(false);

	const handleOpenBookingModal = () => {
		checkAuthAndExecute(() => setShowBookingModal(true));
	};
	const handleCloseBookingModal = () => setShowBookingModal(false);

	const handleSelectCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const cityId = Number(event.target.value);
		const city = cities.find((city) => city.id === cityId);
		if (city) setSelectedCity(city);
	};

	const handleClickCinema = (cinema: CinemaProps) => {
		setSelectedCinema(cinema);
	};

	const handleClickGenre = (genre: GenreProps) => {
		navigate(`${config.routes.search}?g=${genre.slug}`);
	};

	const handleClickShowtime = (
		movie: MovieProps,
		selectedShowtime: ShowtimeDefaultProps
	) => {
		if (!selectedCinema) return;

		const _showtimeId = selectedShowtime.id;
		const movieInfo = movie;
		const cinemaName = selectedCinema.name;
		const listShowtimes = filteredShowtimes;

		checkAuthAndExecute(() => {
			navigate(config.routes.booking.replace(":slug", movie.slug), {
				state: { movieInfo, _showtimeId, listShowtimes, cinemaName },
			});
		});
	};

	const dateTabs = dates.map((date) => {
		const { weekday, formattedDate } = formatDate(date);
		return {
			key: date.getTime(),
			value: date,
			primary: isToday(date) ? "Hôm nay" : weekday,
			secondary: formattedDate,
		};
	});

	if (loading) {
		return <Loading absolute />;
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
									<Badge position="default" isAgeRating>
										{movie.age_rating}
									</Badge>
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
									<span className={clsx(styles["meta-label"])}>
										Quốc gia:&nbsp;
									</span>
									<span>{movie.country}</span>
								</div>
								<div className={clsx(styles["meta-item"])}>
									<span className={clsx(styles["meta-label"])}>
										Ngôn ngữ:&nbsp;
									</span>
									<span>Phụ đề</span>
								</div>

								<div className={clsx(styles["meta-item"])}>
									<span className={clsx(styles["meta-label"])}>
										Thể loại:&nbsp;
									</span>
									<ul className={clsx(styles["genre-list"])}>
										{movie.genres.map((genre) => (
											<li
												key={genre.id}
												className={clsx(styles["genre-item"])}
												onClick={() => handleClickGenre(genre)}
											>
												{genre.name}
											</li>
										))}
									</ul>
								</div>
							</div>
							<div>
								{movie.is_now_showing ? (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										onClick={handleOpenBookingModal}
									>
										Đặt vé ngay
									</Button>
								) : (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										disabled
									>
										Sắp chiếu
									</Button>
								)}
							</div>
						</div>
					</div>

					<div className={clsx(styles["description"])}>
						<h2 className={clsx("border-left-accent")}>Nội dung phim</h2>
						{movie.description?.split("\n").map((text, index) => (
							<p key={index}>{text}</p>
						))}
					</div>
				</div>

				<div className={clsx(styles["section"])}>
					<h2 className={clsx(styles["section-title"], "border-left-accent")}>
						Phim đang chiếu
					</h2>

					<div className={clsx(styles["movie-list"])}>
						{ratedMovies.map((movie) => (
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
			{showBookingModal && (
				<Modal
					isOpen={showBookingModal}
					onClose={handleCloseBookingModal}
					width={1200}
					height={700}
				>
					<div className={clsx(styles["modal-content"])}>
						<div className={clsx(styles["modal-header"])}>
							<Image
								src={movie.poster_url}
								alt={movie.title}
								className={clsx(styles["modal-image"])}
							/>
							<div className={clsx(styles["modal-header-wrapper"])}>
								<h3 className={clsx(styles["modal-header-title"])}>
									{movie.title}
									<Badge position="default" isAgeRating>
										{movie.age_rating}
									</Badge>
								</h3>
								<p className={clsx(styles["modal-header-info"])}>
									<span>Thời lượng:&nbsp;</span>
									{movie.duration_label}
								</p>
								<p className={clsx(styles["modal-header-info"])}>
									<span>Thể loại:&nbsp;</span>
									{movie.genres_list}
								</p>
								<p className={clsx(styles["modal-header-info"])}>
									<span>Quốc gia:&nbsp;</span>
									{movie.country}
								</p>
							</div>
						</div>
						<div className={clsx(styles["modal-body"])}>
							<div className={clsx(styles["modal-left"])}>
								<div className={clsx(styles["modal-select-location"])}>
									<Select
										id="city_id"
										name="city_id"
										onChange={handleSelectCity}
										arrow
									>
										<option value="" disabled>
											Chọn thành phố
										</option>
										{cities.map((city) => (
											<option key={city.id} value={city.id}>
												{city.name}
											</option>
										))}
									</Select>
								</div>

								{selectedCity?.cinemas && (
									<ul className={clsx(styles["cinema-list"])}>
										{selectedCity.cinemas.length > 0 ? (
											selectedCity.cinemas.map((cinema) => (
												<li
													key={cinema.id}
													className={clsx(styles["cinema-item"], {
														[styles["active"]]:
															selectedCinema?.id === cinema.id,
													})}
													onClick={() => handleClickCinema(cinema)}
												>
													<Image
														className={clsx(styles["cinema-image"])}
														src={cinema.image}
														alt={cinema.name}
													/>
													<div className={clsx(styles["cinema-info"])}>
														<h2>{cinema.name}</h2>
														<p className={clsx(styles["cinema-address"])}>
															<LocationOn fontSize="inherit" /> {cinema.address}
														</p>
													</div>
												</li>
											))
										) : (
											<div className={clsx("empty")}>
												<p>
													Không có rạp chiếu phim nào tại {selectedCity.name}
												</p>
											</div>
										)}
									</ul>
								)}
							</div>
							<div className={clsx(styles["modal-right"])}>
								<div className={clsx(styles["date-tabs"])}>
									<Tabs
										items={dateTabs}
										selectedValue={selectedDate}
										onSelect={(date: Date) => {
											setSelectedDate(date);
										}}
										small
										white
									/>
								</div>
								<div className="flex-1">
									<Showtime
										movie={movie}
										showtimes={filteredShowtimes}
										handleClick={handleClickShowtime}
										relative
									/>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}

			<LoginModalComponent />
		</div>
	);
};

export default Movie;
