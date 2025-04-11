import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { cinemaService } from "@/services";
import CinemaForm, { CinemaFormData } from "./CinemaForm";
import { PageWrapper, Card, Skeleton } from "@/components/";

const CinemaEdit = () => {
	const { id } = useParams();
	const [cinema, setCinema] = useState<CinemaFormData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await cinemaService.show(Number(id));
				setCinema(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	const handleSubmit = async (formData: FormData) => {
		try {
			const response = await cinemaService.update(Number(id), formData);
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
					<Skeleton.CinemaSkeleton />
				) : (
					<CinemaForm
						mode="edit"
						initialData={cinema || undefined}
						onSubmit={handleSubmit}
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default CinemaEdit;
