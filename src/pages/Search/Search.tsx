import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterAlt, Favorite, PlayArrow, Star } from "@mui/icons-material";

import { Badge, Button, Container, Input } from "@/components";
import { movieService } from "@/services";
import { MovieProps } from "@/types";

// Danh sách thể loại
const genres = [
	"ACTION",
	"ADVENTURE",
	"ANIMATION",
	"COMEDY",
	"CRIME",
	"DOCUMENTARY",
	"DRAMA",
	"FAMILY",
	"FANTASY",
	"HORROR",
	"MYSTERY",
	"ROMANCE",
	"SCI-FI",
	"THRILLER",
	"WAR",
];

const Search = () => {
	const [searchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
	const [movies, setMovies] = useState<MovieProps[]>([]);

	useEffect(() => {
		try {
			(async () => {
				const response = await movieService.getNowShowingMovies();

				const filteredMovies = response.filter((movie: MovieProps) =>
					movie.title.toLowerCase().includes(searchValue.toLowerCase())
				);
				setMovies(filteredMovies);
			})();
		} catch (error) {
			console.error("Có lỗi xảy ra khi lấy dữ liệu phim:", error);
		}
	}, [searchValue]);

	return (
		<Container className="py-4">
			{/* Start: Search Header */}
			<div className="mb-8 text-center">
				<div className="relative max-w-xl mx-auto">
					<Input
						type="text"
						placeholder="Tìm kiếm phim..."
						defaultValue={searchValue}
						className="bg-white border-gray-300 text-gray-800 rounded-md pl-4 pr-10 py-2 w-full"
					/>
					<button className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-gray-500"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</button>
				</div>
			</div>
			{/* End: Search Header */}

			{/* Start: Search Content */}

			<div className="flex flex-col md:flex-row gap-6">
				{/* Filter Section */}
				<div className="w-full md:w-64 shrink-0">
					<div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
						<div className="flex items-center gap-2 mb-4 font-bold text-[#144184]">
							<FilterAlt className="h-5 w-5" />
							<span>Bộ lọc tìm kiếm</span>
						</div>

						{/* Genres */}
						<div className="mb-6">
							<h3 className="text-sm font-bold mb-3 text-gray-700">GENRES</h3>
							<div className="space-y-2">
								{genres.map((genre) => (
									<div key={genre} className="flex items-center space-x-2">
										<input
											type="checkbox"
											name=""
											id=""
											className="border-gray-400 data-[state=checked]:bg-[#144184] data-[state=checked]:border-[#144184]"
										/>
										<label
											htmlFor={genre}
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{genre}
										</label>
									</div>
								))}
							</div>
						</div>

						{/* Release Date */}
						<div>
							<h3 className="text-sm font-bold mb-3 text-gray-700">
								RELEASE DATE
							</h3>
							<div className="space-y-3">
								<div>
									<p className="text-xs mb-1">FROM</p>
									<div className="bg-white border border-gray-300 rounded text-sm p-2 text-gray-500">
										Click to select a date
									</div>
								</div>
								<div>
									<p className="text-xs mb-1">TO</p>
									<div className="bg-white border border-gray-300 rounded text-sm p-2 text-gray-500">
										Click to select a date
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Results Section */}
				<div className="flex-1">
					<h1 className="text-2xl font-bold mb-6">
						Kết quả tìm kiếm cho{" "}
						<strong className="text-[#144184]">
							&quot;{searchValue}&quot;
						</strong>
					</h1>

					<div className="space-y-8">
						{movies.map((movie) => (
							<div
								key={movie.id}
								className="flex flex-col md:flex-row gap-4 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm"
							>
								{/* Movie Poster */}
								<div className="w-full md:w-48 object-cover shrink-0">
									<img
										src={movie.poster_url || "/placeholder.svg"}
										alt={movie.title}
										className="w-full h-full object-cover"
									/>
								</div>

								{/* Movie Details */}
								<div className="flex-1 p-4">
									<div className="flex flex-col h-full">
										<div>
											<h2 className="text-xl font-bold mb-1">{movie.title}</h2>
											<div className="flex items-center gap-2 mb-2">
												<Badge className="bg-red-600 text-white text-xs">
													{movie.age_rating}
												</Badge>
												<span className="text-sm text-gray-500">
													{movie.duration_label}
												</span>
											</div>
											<p className="text-sm text-gray-600 mb-3 line-clamp-2">
												{movie.description}
											</p>

											{/* Genres */}
											<div className="flex flex-wrap gap-2 mb-3">
												{movie.genres.split(",").map((genre) => (
													<Badge
														key={genre}
														className="border-gray-800 text-gray-700 border p-3"
													>
														{genre}
													</Badge>
												))}
											</div>

											<p className="text-sm text-gray-500 mb-1">
												<span className="font-medium">Release Date:</span>{" "}
												{movie.release_date_label}
											</p>

											{/* Ratings */}
											<div className="flex items-center gap-4 mb-4">
												<div className="flex items-center gap-2">
													<Star className="h-5 w-5 text-yellow-500" />
													<span>{movie.rating}</span>
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="mt-auto flex flex-wrap gap-3">
											<Button
												text
												size="small"
												className="flex items-center gap-1 border-gray-300 text-gray-700"
											>
												<Favorite className="h-4 w-4" />
												<span>Like</span>
											</Button>
											<Button
												text
												size="small"
												className="flex items-center gap-1 border-gray-300 text-gray-700"
											>
												<PlayArrow className="h-4 w-4" />
												<span>Watch Trailer</span>
											</Button>
											<Button className="ml-auto bg-[#144184] hover:bg-[#144184]/90 text-white">
												Đặt vé
											</Button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* End: Search Content */}
		</Container>
	);
};

export default Search;
