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

	// Tìm các cặp ghế sweetbox
	const findSweetBoxPairs = (rowSeats: SeatProps[]) => {
		const sweetboxPairs: Record<string, SeatProps[]> = {};

		// Lọc ra các ghế sweetbox và nhóm theo cặp
		rowSeats.forEach((seat) => {
			if (seat.is_sweetbox) {
				const seatNumber = parseInt(seat.seat_code.slice(1));
				// Xác định số cặp (1-2, 3-4, 5-6, 7-8)
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
					// Sắp xếp ghế theo thứ tự số
					const sortedRowSeats = groupedSeats[row].sort((a, b) => {
						const aCol = parseInt(a.seat_code.slice(1));
						const bCol = parseInt(b.seat_code.slice(1));
						return aCol - bCol;
					});

					// Kiểm tra xem hàng này có ghế sweetbox không
					const hasSweetBox = sortedRowSeats.some((seat) => seat.is_sweetbox);
					const sweetboxPairs = hasSweetBox
						? findSweetBoxPairs(sortedRowSeats)
						: {};

					return (
						<div key={row} className={styles["seat-row"]}>
							<div className={styles["row-label"]}>{row}</div>
							{hasSweetBox ? (
								<>
									{/* Hiển thị các cặp ghế sweetbox */}
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
															[styles.vip]: firstSeat.seat_type === "vip",
															[styles.selected]: isSelected,
														})}
														style={{
															width: "calc(var(--seat-width) * 2 + 4px)",
														}} // Gấp đôi kích thước ghế thường
														onClick={() => {
															if (onClick) {
																// Gọi onClick cho cả hai ghế khi click vào cặp
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
								// Hiển thị bình thường cho hàng không có ghế sweetbox
								sortedRowSeats.map((seat) => (
									<div
										key={seat.id}
										className={clsx(styles.seat, {
											[styles.vip]: seat.seat_type === "vip",
											[styles.selected]: isSeatSelected(seat),
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
			</div>
		</div>
	);
};

export default SeatLayout;
