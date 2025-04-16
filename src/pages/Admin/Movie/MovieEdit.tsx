import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { movieService } from "@/services";
import MovieForm, { MovieFormData } from "./MovieForm";
import { PageWrapper, Card, Skeleton } from "@/components";

const MovieEdit = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState<MovieFormData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await movieService.show(Number(id));
				setMovie(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	const handleSubmit = async (formData: FormData) => {
		try {
			const response = await movieService.update(Number(id), formData);
			return response;
		} catch (error) {
			console.error("Error updating movie:", error);
			throw error;
		}
	};

	return (
		<PageWrapper title="Chỉnh sửa phim">
			<Card>
				{loading ? (
					<Skeleton.MovieSkeleton />
				) : (
					<MovieForm
						mode="edit"
						initialData={movie || undefined}
						onSubmit={handleSubmit}
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default MovieEdit;
