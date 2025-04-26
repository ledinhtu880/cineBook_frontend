import { useState, useEffect, useCallback } from "react";

import { ApiError, Column } from "@/types";
import { cinemaService } from "@/services";
import { useSnackbar } from "@/context";
import { PageWrapper, Loading, Table, Card } from "@/components";

interface CinemaProps {
	id: number;
	name: string;
	address: string;
	phone: string;
	city: {
		id: number;
		name: string;
	};
}

const columns: Column<CinemaProps>[] = [
	{ key: "id", title: "#", width: 75 },
	{ key: "name", title: "Tên", width: 250, tooltip: true },
	{
		key: "address",
		title: "Địa chỉ",
		width: 300,
		align: "left",
		tooltip: true,
	},
	{
		key: "phone",
		title: "Hotline",
	},
	{
		key: "city",
		title: "Thành phố",
		width: 200,
		render: (value) => (value as CinemaProps["city"]).name,
	},
];

const Cinema = () => {
	const { showSnackbar } = useSnackbar();
	const [cinemas, setCinemas] = useState<CinemaProps[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const response = await cinemaService.get("?get-city=true");
				setCinemas(response);
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
		async (record: CinemaProps) => {
			try {
				const response = await cinemaService.delete(record.id);
				if (response.status === "success") {
					setCinemas((prev) =>
						prev.filter((cinema) => cinema.id !== record.id)
					);
					showSnackbar(response.message, "success");
				}
			} catch (error) {
				console.error("Error when delete cinema: ", error);
			}
		},
		[showSnackbar]
	);

	return (
		<PageWrapper title="Quản lý rạp chiếu phim">
			<Card
				title="Danh sách rạp chiếu phim"
				addPath={"/admin/cinemas/create"}
				addLabel="Thêm rạp chiếu phim"
			>
				{loading ? (
					<Loading />
				) : (
					<Table<CinemaProps>
						columns={columns}
						data={cinemas}
						editPath="/admin/cinemas"
						showPath="/admin/cinemas"
						onDelete={handleDelete}
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default Cinema;
