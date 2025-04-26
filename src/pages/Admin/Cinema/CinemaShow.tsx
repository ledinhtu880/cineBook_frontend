import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { roomService, cinemaService } from "@/services/";
import { useSnackbar } from "@/context";
import { ApiError, Column, RoomProps, CinemaProps } from "@/types/";
import { PageWrapper, Loading, Table, Card } from "@/components";

const columns: Column<RoomProps>[] = [
	{ key: "id", title: "#", width: 75 },
	{ key: "name", title: "Tên", width: 250, tooltip: true },
	{ key: "seat_rows", title: "Số hàng", align: "center" },
	{ key: "seat_columns", title: "Số cột", align: "center" },
	{ key: "sweetbox_rows", title: "Số hàng ghế đôi", align: "center" },
];

const Cinema = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { showSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [rooms, setRooms] = useState<RoomProps[]>([]);
	const [cinema, setCinema] = useState<CinemaProps>();

	useEffect(() => {
		(async () => {
			try {
				const response = await cinemaService.show(Number(id));
				setCinema(response);
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.response?.data) {
					showSnackbar(apiError.response.data.message, "error");
				}
			}
		})();
	}, [id, showSnackbar]);

	useEffect(() => {
		(async () => {
			try {
				const response = await cinemaService.getRooms(Number(id));
				setRooms(response);
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.response?.data) {
					showSnackbar(apiError.response.data.message, "error");
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [id, showSnackbar]);

	const handleAddRoom = useCallback(() => {
		navigate(`/admin/cinemas/${id}/rooms/create`, {
			state: { cinema },
		});
	}, [cinema, id, navigate]);

	const handleDelete = useCallback(
		async (record: RoomProps) => {
			try {
				const response = await roomService.delete(record.id);
				if (response.status == "success") {
					setRooms((prev) => prev.filter((room) => room.id !== record.id));
					showSnackbar(response.message, "success");
				}
			} catch (error) {
				console.error("Error when delete room: ", error);
			}
		},
		[showSnackbar]
	);

	if (loading) return <Loading />;

	return (
		<PageWrapper title={`Quản lý phòng chiếu - ${cinema?.name}`}>
			<Card
				title="Quản lý phòng chiếu"
				onAdd={handleAddRoom}
				addLabel="Thêm phòng chiếu"
			>
				<Table<RoomProps>
					columns={columns}
					data={rooms}
					onDelete={handleDelete}
					showPath={`/admin/cinemas/${id}/rooms`}
				/>
			</Card>
		</PageWrapper>
	);
};

export default Cinema;
