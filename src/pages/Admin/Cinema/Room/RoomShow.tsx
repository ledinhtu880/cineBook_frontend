import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";

import styles from "./Room.module.scss";
import { RoomData } from "@/types";
import { roomService } from "@/services";
import { PageWrapper, Card, Loading } from "@/components";

interface Room extends RoomData {
	seats: Seat[];
}

export interface Seat {
	id: number;
	room_id: number;
	seat_code: string;
	seat_type: "normal" | "vip" | "sweetbox";
	is_sweetbox: boolean;
}

interface SeatLayoutProps {
	seats: Seat[];
	isSweetBox: boolean;
}

export const SeatLayout = ({ seats, isSweetBox }: SeatLayoutProps) => {
	const groupedSeats = seats.reduce((acc, seat) => {
		const row = seat.seat_code.charAt(0);
		if (!acc[row]) {
			acc[row] = [];
		}
		acc[row].push(seat);
		return acc;
	}, {} as Record<string, Seat[]>);

	// Sort rows alphabetically
	const sortedRows = Object.keys(groupedSeats).sort();

	return (
		<div className={styles.layout}>
			<div className={styles.screen}>Màn hình</div>
			<div className={styles["seats-container"]}>
				{sortedRows.map((row) => (
					<div key={row} className={styles["seat-row"]}>
						<div className={styles["row-label"]}>{row}</div>
						{groupedSeats[row]
							.sort((a, b) => {
								const aCol = parseInt(a.seat_code.slice(1));
								const bCol = parseInt(b.seat_code.slice(1));
								return aCol - bCol;
							})
							.map((seat) => (
								<div
									key={seat.id}
									className={clsx(styles.seat, {
										[styles.sweetbox]: seat.is_sweetbox,
										[styles.vip]: seat.seat_type === "vip",
									})}
									title={`${seat.seat_code} - ${
										seat.seat_type === "vip"
											? "Ghế VIP"
											: seat.is_sweetbox
											? "Ghế đôi"
											: "Ghế thường"
									}`}
								>
									<span className={styles["seat-label"]}>{seat.seat_code}</span>
								</div>
							))}
					</div>
				))}
			</div>

			{/* Add legend */}
			<div className={styles.legend}>
				<div className={styles["legend-item"]}>
					<div className={clsx(styles["legend-color"], styles.normal)}></div>
					<span>Ghế thường</span>
				</div>
				<div className={styles["legend-item"]}>
					<div className={clsx(styles["legend-color"], styles.vip)}></div>
					<span>Ghế VIP</span>
				</div>
				{isSweetBox && (
					<div className={styles["legend-item"]}>
						<div
							className={clsx(styles["legend-color"], styles.sweetbox)}
						></div>
						<span>Ghế đôi</span>
					</div>
				)}
			</div>
		</div>
	);
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
	<div className={styles.info_card}>
		<span className={styles.info_value}>{value}</span>
		<span className={styles.info_label}>{label}</span>
	</div>
);

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
						{/* <p>
							<span>{room.seats.length}</span>
							Tổng số ghế
						</p>
						<p>
							<span>{normalSeats}</span>
							Ghế thường
						</p>
						<p>
							<span>{vipSeats}</span>
							Ghế VIP
						</p>
						<p>
							<span>{sweetboxSeats}</span>
							Ghế đôi
						</p> */}x
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
