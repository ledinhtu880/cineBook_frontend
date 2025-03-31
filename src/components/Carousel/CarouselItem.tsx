import { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Button from "@/components/Button";
import styles from "./Carousel.module.scss";
import { MovieProps } from "@/types/index";
import Image from "@/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faTicket } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/Tooltip";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "90vw",
	maxWidth: "1000px",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 0,
	outline: "none",
	borderRadius: "8px",
	aspectRatio: "16/9",
};
const CarouselItem = ({ item }: { item: MovieProps }) => {
	const [showTrailer, setShowTrailer] = useState(false);

	const handleOpenTrailer = () => setShowTrailer(true);
	const handleCloseTrailer = () => setShowTrailer(false);

	const getYoutubeEmbedUrl = (url: string) => {
		// Handle different YouTube URL formats
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);

		return match && match[2].length === 11
			? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
			: url;
	};

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
						onClick={handleOpenTrailer}
					>
						Trailer
					</Button>
				</div>
			</div>
			<Tooltip title={item.title}>
				<Link to="#" className={clsx(styles["carousel-title"])}>
					{item.title}
				</Link>
			</Tooltip>

			{showTrailer && (
				<Modal
					open={showTrailer}
					onClose={handleCloseTrailer}
					aria-labelledby="movie-trailer"
				>
					<Box sx={style}>
						<iframe
							src={getYoutubeEmbedUrl(item.trailer_url)}
							title={`${item.title} Trailer`}
							width="100%"
							height="100%"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</Box>
				</Modal>
			)}
		</div>
	);
};

export default CarouselItem;
