import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./Room.module.scss";
import { RoomProps, SeatProps } from "@/types";
import { roomService } from "@/services";
import { Card, Loading, PageWrapper, SeatLayout, StatCard } from "@/components";

interface Room extends RoomProps {
	seats: SeatProps[];
}

const RoomShow = () => {
	const { id } = useParams();
	const [room, setRoom] = useState<Room>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRoom = async () => {
			try {
				const response = await roomService.show(Number(id));
				setRoom(response);
			} catch (error) {
				console.error("Error fetching room:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRoom();
	}, [id]);

	if (loading) return <Loading />;
	if (!room) return <div>Không tìm thấy phòng chiếu</div>;

	const normalSeats = room.seats.filter((s) => s.seat_type === "normal").length;
	const vipSeats = room.seats.filter((s) => s.seat_type === "vip").length;
	const sweetboxSeats = room.seats.filter((s) => s.is_sweetbox).length;

	return (
		<PageWrapper title={`Chi tiết phòng ${room.name}`}>
			<Card title={`${room.cinema_name} - ${room.name}`}>
				<div className={styles.wrapper}>
					<div className={styles.info}>
						<StatCard label="Tổng số ghế" value={room.seats.length} />
						<StatCard label="Ghế thường" value={normalSeats} />
						<StatCard label="Ghế VIP" value={vipSeats} />
						{sweetboxSeats > 0 && (
							<StatCard label="Ghế đôi" value={sweetboxSeats} />
						)}
					</div>
					<SeatLayout seats={room.seats} isSweetBox={sweetboxSeats > 0} />
				</div>
			</Card>
		</PageWrapper>
	);
};

export default RoomShow;
