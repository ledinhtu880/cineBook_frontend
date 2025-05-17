import clsx from "clsx";

import styles from "./SeatLayout.module.scss";
import { SeatProps } from "@/types";
import { Tooltip } from "@/components";

interface SeatLayoutProps {
	seats: SeatProps[];
	isSweetBox: boolean;
	selectedSeats?: SeatProps[];
	onClick?: (seat: SeatProps) => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
	seats,
	isSweetBox,
	selectedSeats,
	onClick,
}) => {
	const groupedSeats = seats.reduce((acc, seat) => {
		const row = seat.seat_code.charAt(0);
		if (!acc[row]) {
			acc[row] = [];
		}
		acc[row].push(seat);
		return acc;
	}, {} as Record<string, SeatProps[]>);

	const isSeatSelected = (seat: SeatProps) => {
		return selectedSeats?.some((s) => s.id === seat.id);
	};

	const findSweetBoxPairs = (rowSeats: SeatProps[]) => {
		const sweetboxPairs: Record<string, SeatProps[]> = {};

		rowSeats.forEach((seat) => {
			if (seat.is_sweetbox) {
				const seatNumber = parseInt(seat.seat_code.slice(1));
				const pairKey = Math.ceil(seatNumber / 2);
				if (!sweetboxPairs[pairKey]) {
					sweetboxPairs[pairKey] = [];
				}
				sweetboxPairs[pairKey].push(seat);
			}
		});

		return sweetboxPairs;
	};

	const sortedRows = Object.keys(groupedSeats).sort();

	return (
		<div className={styles.layout}>
			<div className={styles.screen}>Màn hình</div>
			<div className={styles["seats-container"]}>
				{sortedRows.map((row) => {
					const sortedRowSeats = groupedSeats[row].sort((a, b) => {
						const aCol = parseInt(a.seat_code.slice(1));
						const bCol = parseInt(b.seat_code.slice(1));
						return aCol - bCol;
					});

					const hasSweetBox = sortedRowSeats.some((seat) => seat.is_sweetbox);
					const sweetboxPairs = hasSweetBox
						? findSweetBoxPairs(sortedRowSeats)
						: {};

					return (
						<div key={row} className={styles["seat-row"]}>
							<div className={styles["row-label"]}>{row}</div>
							{hasSweetBox ? (
								<>
									{Object.values(sweetboxPairs).map((pairSeats) => {
										if (pairSeats.length === 2) {
											const firstSeat = pairSeats[0];
											const secondSeat = pairSeats[1];
											const pairId = `${firstSeat.id}-${secondSeat.id}`;
											const isSelected =
												isSeatSelected(firstSeat) && isSeatSelected(secondSeat);

											return (
												<Tooltip
													key={pairId}
													title={`${
														firstSeat.seat_code
													}-${secondSeat.seat_code.slice(1)} - Ghế đôi`}
												>
													<div
														className={clsx(styles.seat, styles.sweetbox, {
															[styles.selected]: isSelected,
															[styles.booked]: firstSeat.status === "booked",
														})}
														style={{
															width: "calc(var(--seat-width) * 2 + 4px)",
														}}
														onClick={() => {
															if (onClick) {
																onClick(firstSeat);
																onClick(secondSeat);
															}
														}}
													>
														<span className={styles["seat-label"]}>
															{firstSeat.seat_code}-
															{secondSeat.seat_code.slice(1)}
														</span>
													</div>
												</Tooltip>
											);
										}
										return null;
									})}
								</>
							) : (
								sortedRowSeats.map((seat) => (
									<div
										key={seat.id}
										className={clsx(styles.seat, {
											[styles.vip]: seat.seat_type === "vip",
											[styles.selected]: isSeatSelected(seat),
											[styles.booked]: seat.status === "booked",
										})}
										onClick={() => onClick && onClick(seat)}
										title={`${seat.seat_code} - ${
											seat.seat_type === "vip" ? "Ghế VIP" : "Ghế thường"
										}`}
									>
										<span className={styles["seat-label"]}>
											{seat.seat_code}
										</span>
									</div>
								))
							)}
						</div>
					);
				})}
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
				<div className={styles["legend-item"]}>
					<div className={clsx(styles["legend-color"], styles.booked)}></div>
					<span>Ghế đã được đặt</span>
				</div>
			</div>
		</div>
	);
};

export default SeatLayout;
