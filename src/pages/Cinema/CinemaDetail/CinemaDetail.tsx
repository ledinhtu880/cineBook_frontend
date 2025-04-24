import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./CinemaDetail.module.scss";
import config from "@/config";
import { useAuth } from "@/hooks";
import { cinemaService, cityService } from "@/services";
import { CinemaProps, CityProps, MovieProps, ShowtimeProps } from "@/types";
import { Button, Container, Image, Loading, Select, Tabs } from "@/components";

interface Props extends MovieProps {
	showtimes: ShowtimeProps[];
}

const CinemaDetail = () => {
	const navigate = useNavigate();
	const { slug } = useParams();
	const [loading, setLoading] = useState(true);
	const [cities, setCities] = useState<CityProps[]>([]);
	const [selectedCity, setSelectedCity] = useState<CityProps>({} as CityProps);
	const [selectedCinema, setSelectedCinema] = useState<CinemaProps>(
		{} as CinemaProps
	);

	const [dates, setDates] = useState<Date[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [expandMovie, setExpandMovie] = useState<number | null>(null);
	const [movies, setMovies] = useState([]);
	const [filteredMovies, setFilteredMovies] = useState<Props[]>([]);
	const { checkAuthAndExecute, LoginModalComponent } = useAuth();

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
				const CinemaProps = await cinemaService.getCinemaBySlug(slug);
				setSelectedCinema(CinemaProps);
				document.title = "Rạp " + CinemaProps.name + " - Lịch chiếu phim";

				const citiesData = await cityService.getWithCinemas();
				setCities(citiesData);

				const city = citiesData.find(
					(city: CityProps) => city.id === CinemaProps.city?.id
				);
				if (city) {
					setSelectedCity(city);
				}
			} catch (error) {
				console.error("Lỗi khi tải dữ liệu rạp chiếu phim:", error);
			}
		})();
	}, [slug]);

	useEffect(() => {
		(async () => {
			if (!selectedCinema.slug) return;

			try {
				const response = await cinemaService.getShowtimese(selectedCinema.slug);
				setMovies(response);
			} catch (error) {
				console.error("Lỗi khi tải dữ liệu suất chiếu:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, [selectedCinema.slug]);

	useEffect(() => {
		(() => {
			if (!movies.length) return;

			const formattedDate = selectedDate.toISOString().split("T")[0];

			const filtered = movies
				.map((movie: Props) => {
					const movieCopy = { ...movie };

					const filteredShowtimes = movie.showtimes.filter(
						(showtime) => showtime.date === formattedDate
					);

					movieCopy.showtimes = filteredShowtimes;
					return movieCopy;
				})
				.filter((movie) => movie.showtimes.length > 0);

			setFilteredMovies(filtered);
		})();
	}, [selectedDate, movies]);

	const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const cityId = Number(event.target.value);
		const city = cities.find((city) => city.id === cityId);
		if (city) {
			setSelectedCity(city);

			if (city.cinemas) {
				setSelectedCinema(city.cinemas[0]);
				navigate(
					config.routes.cinema_detail.replace(":slug", city.cinemas[0].slug)
				);
			}
		}
	};

	const handleCinemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const cinemaId = Number(event.target.value);
		const cinemas = selectedCity.cinemas || [];
		const cinema = cinemas.find((cinema) => cinema.id === cinemaId);
		if (cinema) {
			setSelectedCinema(cinema);
			navigate(config.routes.cinema_detail.replace(":slug", cinema.slug));
		}
	};

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
		setExpandMovie(null);
	};

	const handleClick = (movie: MovieProps, showtime: ShowtimeProps) => {
		const showtimeWithCinema = {
			...showtime,
			cinema: {
				name: selectedCinema.name,
			},
		};

		const movieWithShowtime = movie;

		checkAuthAndExecute(() => {
			navigate(config.routes.booking.replace(":slug", movie.slug), {
				state: { movieWithShowtime, showtimeWithCinema },
			});
		});
	};

	const toggleMovieExpand = (movieId: number) => {
		if (expandMovie === movieId) {
			setExpandMovie(null);
		} else {
			setExpandMovie(movieId);
		}
	};

	const formatDate = (date: Date) => {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
		const formattedDate = `${day.toString().padStart(2, "0")}/${month
			.toString()
			.padStart(2, "0")}`;

		return { day, month, weekday, formattedDate };
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
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

	if (loading) return <Loading absolute />;

	if (!selectedCinema) {
		return <div>Không tìm thấy rạp chiếu phim</div>;
	}

	return (
		<>
			<div className={clsx(styles["cinema-wrapper"])}>
				<Container>
					<div className={clsx(styles["cinema-content"])}>
						<div className={clsx(styles["cinema-left"])}>
							<Image
								className={clsx(styles["cinema-image"])}
								src={selectedCinema.image}
								alt={selectedCinema.name}
							/>
							<div className={clsx(styles["cinema-info"])}>
								<h1 className={clsx(styles["cinema-name"])}>
									{selectedCinema.name}
								</h1>
								<div>
									<p className={clsx(styles["cinema-item"])}>
										<span className={clsx(styles["cinema-item-label"])}>
											Địa chỉ:
										</span>
										{selectedCinema.address}
									</p>
									<p className={clsx(styles["cinema-item"])}>
										<span className={clsx(styles["cinema-item-label"])}>
											Hotline:
										</span>
										<a
											href={`tel:${selectedCinema.phone}`}
											className={clsx(styles["cinema-item-link"])}
										>
											{selectedCinema.phone}
										</a>
									</p>
									<p className={clsx(styles["cinema-item"])}>
										<span className={clsx(styles["cinema-item-label"])}>
											Giờ mở cửa:
										</span>
										{selectedCinema.opening_hours}
									</p>
								</div>
							</div>
						</div>
						<div className={clsx(styles["cinema-right"])}>
							<Select
								id="selected_city"
								className={clsx(styles["cinema-select"], "min-w-[200px]")}
								value={selectedCity?.id}
								onChange={handleCityChange}
							>
								{cities.map((city) => (
									<option key={city.id} value={city.id}>
										{city.name}
									</option>
								))}
							</Select>
							<Select
								id="selected_cinema"
								className={clsx(styles["cinema-select"], "min-w-[250px]")}
								value={selectedCinema?.id}
								onChange={handleCinemaChange}
							>
								{selectedCity?.cinemas?.map((city) => (
									<option key={city.id} value={city.id}>
										{city.name}
									</option>
								))}
							</Select>
						</div>
					</div>
				</Container>
			</div>
			<Container>
				<div className={clsx(styles["showtime-wrapper"])}>
					<header>
						<h2
							className={clsx(styles["showtime-title"], "border-left-accent")}
						>
							Phim
						</h2>
						<p className={clsx(styles["showtime-note"])}>
							Chọn phim để xem lịch chiếu
						</p>

						<div className={clsx(styles["date-tabs"])}>
							<Tabs
								items={dateTabs}
								selectedValue={selectedDate}
								onSelect={handleDateSelect}
							/>
						</div>
					</header>
					<div className={clsx(styles["showtime-content"])}>
						{filteredMovies && filteredMovies.length > 0 ? (
							filteredMovies.map((movie: Props) => {
								return (
									<div key={movie.id}>
										<div
											className="cursor-pointer"
											onClick={() => toggleMovieExpand(movie.id)}
										>
											<Image src={movie.poster_url} alt={movie.title} />
											<h5
												className={clsx(styles["movie-title"], {
													[styles["movie-title-active"]]:
														expandMovie === movie.id,
												})}
											>
												{movie.title}
											</h5>
										</div>
										{expandMovie === movie.id && (
											<>
												<div className={clsx(styles["showtime-container"])}>
													{movie.showtimes.length > 0 && (
														<div className={clsx(styles["showtime-card"])}>
															<span
																className={clsx(
																	styles["showtime-label"],
																	"border-left-accent"
																)}
															>
																Suất chiếu
															</span>
															<div className="flex gap-3">
																{movie.showtimes.map((showtime) => (
																	<Button
																		key={showtime.id}
																		className={clsx(styles["showtime-button"])}
																		onClick={() => handleClick(movie, showtime)}
																	>
																		<div
																			className={clsx(styles["showtime-time"])}
																		>
																			{showtime.start_time}
																		</div>
																		<div
																			className={clsx(
																				styles["showtime-room-label"]
																			)}
																		>
																			{showtime.room.name}
																		</div>
																	</Button>
																))}
															</div>
														</div>
													)}
												</div>
												<div className="h-[136px]"></div>
											</>
										)}
									</div>
								);
							})
						) : (
							<p className={clsx("empty", "col-span-full")}>
								Không có suất chiếu nào cho ngày này
							</p>
						)}
					</div>
				</div>
			</Container>
			<LoginModalComponent />
		</>
	);
};

export default CinemaDetail;
