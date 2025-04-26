import { useState, useEffect, useCallback } from "react";

import { useDebounce } from "@/hooks";
import { useSnackbar } from "@/context";
import { movieService } from "@/services/";
import { ApiError, Column, MovieProps } from "@/types/";
import { PageWrapper, Loading, Table, Card } from "@/components";

const columns: Column<MovieProps>[] = [
	{ key: "id", title: "#", width: 75 },
	{ key: "title", title: "Tên", width: 250, tooltip: true },
	{ key: "duration_label", title: "Thời lượng", width: 130, align: "left" },
	{
		key: "genres",
		title: "Thể loại",
		width: 250,
		align: "left",
		tooltip: true,
	},
	{
		key: "release_date_label",
		title: "Ngày khởi chiếu",
		align: "center",
	},
];

const Movie = () => {
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState("");
	const debouncedValue = useDebounce(searchKeyword, 250);
	const { showSnackbar } = useSnackbar();

	const filteredMovies = movies.filter(
		(movie) =>
			movie.title.toLowerCase().includes(debouncedValue.toLowerCase()) ||
			movie.genres.toLowerCase().includes(debouncedValue.toLowerCase())
	);

	const handleDelete = useCallback(
		async (record: MovieProps) => {
			try {
				const response = await movieService.delete(record.id);
				if (response.status === "success") {
					setMovies((prev) => prev.filter((movie) => movie.id !== record.id));
					showSnackbar(response.message, "success");
				}
			} catch (error) {
				console.error(error);
			}
		},
		[showSnackbar]
	);

	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getMovies();
				setMovies(response);
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

	return (
		<PageWrapper title="Quản lý phim">
			<Card
				title="Danh sách phim"
				addPath={"/admin/movies/create"}
				addLabel="Thêm phim"
				onSearch={setSearchKeyword}
				searchValue={searchKeyword}
			>
				{loading ? (
					<Loading />
				) : (
					<Table<MovieProps>
						columns={columns}
						data={filteredMovies}
						editPath="/admin/movies"
						onDelete={handleDelete}
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default Movie;
