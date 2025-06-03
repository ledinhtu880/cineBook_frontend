import { useState, useEffect, useCallback } from "react";
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
import type {
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
	Image as UiImage,
	Modal,
	MovieGenre,
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

	// Chỉ cần 1 trạng thái loading chính
	const [pageLoading, setPageLoading] = useState(true);
	const [showtimesLoading, setShowtimesLoading] = useState(true);
	const [imagesLoaded, setImagesLoaded] = useState(false);

	const { checkAuthAndExecute, renderLoginModals } = useAuth();

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

	// Load tất cả dữ liệu cần thiết cùng lúc
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				if (!slug) return;

				// Thực hiện tất cả các API calls song song
				const [movieResponse, ratedMoviesResponse, citiesResponse] =
					await Promise.all([
						movieService.getMovieBySlug(slug),
						movieService.getTopRatedNowShowingMovies({
							limit: 3,
							sort: "rating",
							order: "desc",
						}),
						cityService.getWithCinemas(),
					]);

				// Set dữ liệu
				setMovie(movieResponse);
				document.title = movieResponse.title;

				setRatedMovies(ratedMoviesResponse);

				setCities(citiesResponse);
				if (citiesResponse && citiesResponse.length > 0) {
					setSelectedCity(citiesResponse[0]);
					setSelectedCinema(citiesResponse[0].cinemas[0]);
				}

				// Preload các ảnh quan trọng
				await preloadImages([
					movieResponse.banner_url,
					movieResponse.poster_url,
					...ratedMoviesResponse.map((movie: MovieProps) => movie.poster_url),
				]);

				setImagesLoaded(true);
			} catch (error) {
				console.error("Lỗi khi tải dữ liệu:", error);
				setImagesLoaded(true); // Vẫn ẩn loading nếu có lỗi
			} finally {
				setPageLoading(false);
			}
		};

		loadInitialData();
	}, [slug]);

	// Hàm preload ảnh
	const preloadImages = (imageUrls: string[]) => {
		return Promise.all(
			imageUrls.map((url) => {
				return new Promise((resolve) => {
					const img = new Image() as HTMLImageElement;
					img.onload = () => resolve(true);
					img.onerror = () => {
						console.warn(`Failed to preload image: ${url}`);
						resolve(false);
					};
					// Đặt timeout 3 giây
					setTimeout(() => resolve(false), 3000);
					img.src = url;
				});
			})
		);
	};

	// Load showtimes riêng biệt khi có movie
	useEffect(() => {
		const fetchShowtimes = async () => {
			if (!movie) return;

			try {
				setShowtimesLoading(true);
				const data = await movieService.getShowtimese(movie.id);
				setShowtimes(data);
			} catch (error) {
				console.error(
					"Có lỗi xảy ra trong quá trình tải danh sách suất chiếu:",
					error
				);
			} finally {
				setShowtimesLoading(false);
			}
		};

		fetchShowtimes();
	}, [movie]);

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

	const handleOpenTrailer = useCallback(() => {
		setShowTrailer(true);
	}, []);
	const handleCloseTrailer = useCallback(() => {
		setShowTrailer(false);
	}, []);

	const handleOpenBookingModal = useCallback(() => {
		setShowBookingModal(true);
	}, []);

	const handleCloseBookingModal = useCallback(() => {
		setShowBookingModal(false);
	}, []);

	const handleSelectCity = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			const cityId = Number(event.target.value);
			const city = cities.find((city) => city.id === cityId);
			if (city) setSelectedCity(city);
		},
		[cities]
	);

	const handleClickCinema = (cinema: CinemaProps) => {
		setSelectedCinema(cinema);
	};

	const handleClickGenre = useCallback(
		(genre: GenreProps) => {
			navigate(`${config.routes.search}?g=${genre.slug}`);
		},
		[navigate]
	);

	const handleClickShowtime = useCallback(
		(movie: MovieProps, selectedShowtime: ShowtimeDefaultProps) => {
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
		},
		[navigate, selectedCinema, filteredShowtimes, checkAuthAndExecute]
	);

	const dateTabs = dates.map((date) => {
		const { weekday, formattedDate } = formatDate(date);
		return {
			key: date.getTime(),
			value: date,
			primary: isToday(date) ? "Hôm nay" : weekday,
			secondary: formattedDate,
		};
	});

	// Hiển thị loading khi đang tải dữ liệu chính hoặc ảnh chưa load xong
	if (pageLoading || !imagesLoaded) {
		return <Loading full />;
	}

	if (!movie) {
		return <div>Không tìm thấy phim</div>;
	}

	return (
		<div className={clsx(styles["wrapper"])}>
			<div className={clsx(styles["banner-wrapper"])}>
				<div className="relative h-[500px]">
					<UiImage
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
							<UiImage
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
									<MovieGenre movie={movie} handleClick={handleClickGenre} />
								</div>
							</div>
							<div>
								{showtimesLoading ? (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										disabled
									>
										<span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
										Đang tải...
									</Button>
								) : showtimes && showtimes.length > 0 ? (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										onClick={handleOpenBookingModal}
									>
										Đặt vé ngay
									</Button>
								) : movie.release_date &&
								  new Date(movie.release_date) > new Date() ? (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										disabled
									>
										Sắp chiếu
									</Button>
								) : (
									<Button
										primary
										className={clsx(styles["action-btn"])}
										disabled
									>
										Hết suất chiếu
									</Button>
								)}
							</div>
						</div>
					</div>

					<div className={clsx(styles["description"])}>
						<h2 className={clsx("border-left-accent")}>Nội dung phim</h2>
						{movie.description?.split("\n").map((text, index) => (
							<p key={index}>{text.trim()}</p>
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
							<UiImage
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
													<UiImage
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
									{showtimesLoading ? (
										<div className="p-6 text-center">
											<div className="inline-block w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
											<p className="mt-2 text-gray-600">
												Đang tải lịch chiếu...
											</p>
										</div>
									) : (
										<Showtime
											movie={movie}
											showtimes={filteredShowtimes}
											handleClick={handleClickShowtime}
											relative
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{renderLoginModals(true)}
		</div>
	);
};

export default Movie;
