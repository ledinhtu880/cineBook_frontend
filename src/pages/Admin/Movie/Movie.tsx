import { useState, useEffect } from "react";

import PageWrapper from "@/components/PageWrapper";
import Loading from "@/components/Loading";
import Table from "@/components/Table";
import Card from "@/components/Card";
import { movieService } from "@/services/";
import { useDebounce } from "@/hooks";
import { ApiError } from "@/types/";
import { Column } from "@/types/";

interface MovieData {
	id: number;
	title: string;
	duration: string;
	release_date: string;
	poster_url: string;
	trailer_url: string;
	age_rating: string;
}

const columns: Column<MovieData>[] = [
	{ key: "id", title: "#" },
	{ key: "title", title: "Tên" },
	{ key: "duration", title: "Thời lượng", align: "center" },
	{ key: "release_date", title: "Ngày khởi chiếu", align: "center" },
];

const Movie = () => {
	const [movies, setMovies] = useState<MovieData[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState("");
	const debouncedValue = useDebounce(searchKeyword, 250);

	const filteredMovies = movies.filter((movie) =>
		movie.title.toLowerCase().includes(debouncedValue.toLowerCase())
	);

	const handleDelete = (record: MovieData) => {
		// Handle delete action here
		console.log("Delete record:", record);
	};

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
			<Card title="Danh sách phim" action onSearch={setSearchKeyword}>
				{loading ? (
					<Loading />
				) : (
					<Table<MovieData>
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
