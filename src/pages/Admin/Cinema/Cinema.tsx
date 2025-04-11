import { useState, useEffect, useCallback } from "react";

import { PageWrapper, Loading, Table, Card } from "@/components/";
import { ApiError, Column } from "@/types/";
import { cinemaService } from "@/services/";
import { useSnackbar } from "@/context";

interface CinemaData {
	id: number;
	name: string;
	address: string;
	phone: string;
	city: {
		id: number;
		name: string;
	};
}

const columns: Column<CinemaData>[] = [
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
		render: (value) => (value as CinemaData["city"]).name,
	},
];

const Cinema = () => {
	const { showSnackbar } = useSnackbar();
	const [cinemas, setCinemas] = useState<CinemaData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const response = await cinemaService.get();
				setCinemas(response);
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

	const handleDelete = useCallback(
		async (record: CinemaData) => {
			try {
				await cinemaService.delete(record.id);
				setCinemas((prev) => prev.filter((cinema) => cinema.id !== record.id));
				showSnackbar("Xóa phim thành công", "success");
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
					<Table<CinemaData>
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
