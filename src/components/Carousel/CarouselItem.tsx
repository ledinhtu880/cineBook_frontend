import clsx from "clsx";
import { Link } from "react-router-dom";

import Button from "@/components/Button";
import styles from "./Carousel.module.scss";
import { MovieProps } from "@/types/index";
import Image from "@/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faTicket } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

const CarouselItem = ({ item }: { item: MovieProps }) => {
	return (
		<div className={clsx(styles["carousel-item-wrapper"])}>
			<div className={clsx(styles["carousel-item"])}>
				<Image
					src={item.poster_url}
					alt={item.title}
					className={clsx(styles["carousel-image"])}
				/>
				<div className={clsx(styles["carousel-badge"])}>
					<span>{item.age_rating}</span>
				</div>
				<div className={clsx(styles["carousel-overlay"])}>
					<Button
						size="small"
						className={clsx(styles["carousel-btn"])}
						primary
						leftIcon={<FontAwesomeIcon icon={faTicket} />}
					>
						Mua vé
					</Button>
					<Button
						size="small"
						className={clsx(styles["carousel-btn"])}
						outline
						leftIcon={<FontAwesomeIcon icon={faCirclePlay} />}
					>
						Trailer
					</Button>
				</div>
			</div>
			<Tooltip
				title={item.title}
				placement="bottom"
				arrow
				sx={{ fontSize: "30" }}
				slotProps={{
					tooltip: {
						sx: {
							color: "#fff",
							backgroundColor: "#333",
						},
					},
					arrow: {
						sx: {
							color: "#333",
						},
					},
				}}
			>
				<Link to="#" className={clsx(styles["carousel-title"])}>
					{item.title}
				</Link>
			</Tooltip>
		</div>
	);
};

export default CarouselItem;
