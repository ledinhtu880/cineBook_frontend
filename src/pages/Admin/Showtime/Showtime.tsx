import { useState, useCallback, useEffect, useMemo } from "react";
import { useSnackbar } from "@/context";
import clsx from "clsx";

import styles from "./Showtime.module.scss";
import { useDebounce } from "@/hooks";
import { Column, ApiError } from "@/types";
import { showtimeService } from "@/services";
import {
	Card,
	Container,
	PageWrapper,
	Table,
	Loading,
	Select,
} from "@/components";

interface ShowtimeProps {
	id: number;
	movie: {
		id: number;
		title: string;
		duration: string | number;
		poster: string;
	};
	room: {
		id: number;
		name: string;
		cinema_name: string;
	};
	time: {
		start_time: string;
		end_time: string;
		start_time_formatted: string;
		end_time_formatted: string;
		date: string;
	};
}

interface ShowtimeStatusProps {
	startTime: string;
	endTime: string;
}

const ShowtimeStatus = ({ startTime, endTime }: ShowtimeStatusProps) => {
	const now = new Date();
	const start = new Date(startTime);
	const end = new Date(endTime);

	let status = "upcoming";
	if (now > end) status = "ended";
	if (now >= start && now <= end) status = "playing";

	return (
		<div className={`status-badge ${status}`}>
			{status === "upcoming" && "Sắp chiếu"}
			{status === "playing" && "Đang chiếu"}
			{status === "ended" && "Đã chiếu"}
		</div>
	);
};

const columns: Column<ShowtimeProps>[] = [
	{
		title: "Thông tin phim",
		key: "movie",
		render: (record) => {
			const movie = record as ShowtimeProps["movie"];
			return (
				<div className={clsx(styles["movie-info"])}>
					<img
						src={movie.poster}
						alt={movie.title}
						className="w-12 h-16 object-cover rounded"
					/>
					<div className="ml-3">
						<h4 className="font-medium">{movie.title}</h4>
						<p className="text-sm text-gray-500">{movie.duration} phút</p>
					</div>
				</div>
			);
		},
	},
	{
		title: "Thông tin rạp",
		key: "room",
		render: (record) => {
			const room = record as ShowtimeProps["room"];
			return (
				<div className={clsx(styles["cinema-info"])}>
					<div className="font-medium">{room.cinema_name}</div>
					<div className="text-sm text-gray-500">Phòng: {room.name}</div>
				</div>
			);
		},
	},
	{
		title: "Thời gian chiếu",
		key: "time",
		render: (record) => {
			const time = record as ShowtimeProps["time"];
			return (
				<div className={clsx(styles["showtime-info"])}>
					<ShowtimeStatus startTime={time.start_time} endTime={time.end_time} />
					<div className="mt-2">
						<div>{time.date}</div>
						<div className="text-sm text-gray-500">
							{time.start_time_formatted} - {time.end_time_formatted}
						</div>
					</div>
				</div>
			);
		},
	},
];

const Showtime = () => {
	const { showSnackbar } = useSnackbar();
	const [showtimes, setShowtimes] = useState<ShowtimeProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedCinema, setSelectedCinema] = useState<string>("");
	const [selectedMovie, setSelectedMovie] = useState<string>("");
	const [searchKeyword, setSearchKeyword] = useState("");
	const debouncedValue = useDebounce(searchKeyword, 250);

	const uniqueCinemas = useMemo(
		() => [...new Set(showtimes.map((s) => s.room.cinema_name))].sort(),
		[showtimes]
	);

	const uniqueMovies = useMemo(
		() =>
			Array.from(
				new Map(
					showtimes.map((s) => [
						s.movie.id,
						{ id: s.movie.id, title: s.movie.title },
					])
				).values()
			).sort((a, b) => a.title.localeCompare(b.title)),
		[showtimes]
	);

	const filteredShowtimes = useMemo(() => {
		let filtered = [...showtimes];

		const searchTerm = debouncedValue.trim().toLowerCase();
		if (searchTerm) {
			filtered = filtered.filter(
				(showtime) =>
					showtime.movie.title.toLowerCase().includes(searchTerm) ||
					showtime.room.cinema_name.toLowerCase().includes(searchTerm)
			);
		}

		if (selectedDate) {
			filtered = filtered.filter(
				(showtime) => showtime.time.date === selectedDate
			);
		}

		if (selectedCinema) {
			filtered = filtered.filter(
				(showtime) => showtime.room.cinema_name === selectedCinema
			);
		}

		if (selectedMovie) {
			filtered = filtered.filter(
				(showtime) => showtime.movie.id === Number(selectedMovie)
			);
		}

		return filtered;
	}, [showtimes, selectedDate, selectedCinema, selectedMovie, debouncedValue]);

	const uniqueDates = useMemo(() => {
		const dates = [...new Set(showtimes.map((s) => s.time.date))];
		return dates.sort();
	}, [showtimes]);

	const resetFilters = () => {
		setSelectedDate("");
		setSelectedCinema("");
		setSelectedMovie("");
		setSearchKeyword("");
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await showtimeService.get();
				setShowtimes(response);
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.response?.data) {
					showSnackbar(apiError.response.data.message, "error");
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [showSnackbar]);

	const handleDelete = useCallback(
		async (record: ShowtimeProps) => {
			try {
				const response = await showtimeService.delete(record.id);
				if (response.status == "success") {
					showSnackbar(response.message, "success");
					setShowtimes((prev) => prev.filter((item) => item.id !== record.id));
				}
			} catch (error) {
				console.error("Error deleting showtime:", error);
				showSnackbar("Xóa suất chiếu thất bại", "error");
			}
		},
		[showSnackbar]
	);

	return (
		<PageWrapper title="Quản lý suất chiếu">
			<Card
				onSearch={setSearchKeyword}
				title="Danh sách suất chiếu"
				addLabel="Thêm suất chiếu"
				addPath="/admin/showtimes/create"
				searchValue={searchKeyword}
			>
				<div className={clsx(styles["filters-container"])}>
					<div className={clsx(styles["filters"])}>
						<div className={clsx(styles["filter-group"])}>
							<Select
								id="select-date"
								label="Ngày chiếu"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
							>
								<option value="">Tất cả ngày</option>
								{uniqueDates.map((date) => (
									<option key={date} value={date}>
										{date}
									</option>
								))}
							</Select>
						</div>

						<div className={clsx(styles["filter-group"])}>
							<Select
								id="select-cinema"
								label="Rạp chiếu"
								value={selectedCinema}
								onChange={(e) => setSelectedCinema(e.target.value)}
							>
								<option value="">Tất cả rạp</option>
								{uniqueCinemas.map((cinema) => (
									<option key={cinema} value={cinema}>
										{cinema}
									</option>
								))}
							</Select>
						</div>

						<div className={clsx(styles["filter-group"])}>
							<Select
								id="select-movie"
								label="Phim"
								value={selectedMovie}
								onChange={(e) => setSelectedMovie(e.target.value)}
							>
								<option value="">Tất cả phim</option>
								{uniqueMovies.map((movie) => (
									<option key={movie.id} value={movie.id}>
										{movie.title}
									</option>
								))}
							</Select>
						</div>
					</div>

					<button
						onClick={resetFilters}
						className={clsx(styles["reset-button"])}
					>
						Xóa bộ lọc
					</button>
				</div>

				<div className={clsx(styles["results-summary"])}>
					{!loading && (
						<div>
							Tìm thấy{" "}
							<span className={clsx(styles["highlight"])}>
								{filteredShowtimes.length}
							</span>{" "}
							suất chiếu
							{searchKeyword.trim() && (
								<span>
									{" "}
									với từ khóa{" "}
									<span className={clsx(styles["highlight"])}>
										"{searchKeyword.trim()}"
									</span>
								</span>
							)}
							{selectedMovie &&
								uniqueMovies.find((m) => m.id.toString() === selectedMovie) && (
									<span>
										{" "}
										cho phim{" "}
										<span className={clsx(styles["highlight"])}>
											{
												uniqueMovies.find(
													(m) => m.id.toString() === selectedMovie
												)?.title
											}
										</span>
									</span>
								)}
							{selectedCinema && (
								<span>
									{" "}
									tại{" "}
									<span className={clsx(styles["highlight"])}>
										{selectedCinema}
									</span>
								</span>
							)}
							{selectedDate && (
								<span>
									{" "}
									vào ngày{" "}
									<span className={clsx(styles["highlight"])}>
										{selectedDate}
									</span>
								</span>
							)}
						</div>
					)}
				</div>

				{loading ? (
					<Container className="pb-20">
						<Loading absolute />
					</Container>
				) : (
					<>
						{filteredShowtimes.length > 0 ? (
							<Table<ShowtimeProps>
								columns={columns}
								data={filteredShowtimes}
								onDelete={handleDelete}
								showPath="/admin/showtimes"
								pageSize={20}
							/>
						) : (
							<div className={clsx(styles["no-results"])}>
								<p>Không tìm thấy suất chiếu nào phù hợp với bộ lọc đã chọn</p>
								<button
									onClick={resetFilters}
									className={clsx(styles["reset-button-inline"])}
								>
									Xóa bộ lọc
								</button>
							</div>
						)}
					</>
				)}
			</Card>
		</PageWrapper>
	);
};

export default Showtime;
