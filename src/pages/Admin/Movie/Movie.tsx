import { useState, useEffect, useCallback } from "react";

import { PageWrapper, Loading, Table, Card } from "@/components/";
import { movieService } from "@/services/";
import { useDebounce } from "@/hooks";
import { ApiError, Column, MovieProps } from "@/types/";
import { useSnackbar } from "@/context";

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

	const filteredMovies = movies.filter((movie) =>
		movie.title.toLowerCase().includes(debouncedValue.toLowerCase())
	);

	const handleDelete = useCallback(
		async (record: MovieProps) => {
			try {
				await movieService.delete(record.id);
				setMovies((prev) => prev.filter((movie) => movie.id !== record.id));
				showSnackbar("Xóa phim thành công", "success");
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
				if (apiError.response?.data?.errors) {
					console.log(apiError.response?.data?.errors);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<PageWrapper title="Quản lý phim">
			<Card
				title="Danh sách phim"
				addPath={"/admin/movies/create"}
				addLabel="Thêm phim"
				onSearch={setSearchKeyword}
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
