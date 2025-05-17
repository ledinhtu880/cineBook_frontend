import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmationNumber, PlayCircle } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Carousel.module.scss";
import config from "@/config";
import { MovieProps } from "@/types";
import { getYoutubeEmbedUrl } from "@/utils";
import { Badge, Box, Button, Image, Modal, Tooltip } from "@/components";

const CarouselItem = ({ item }: { item: MovieProps }) => {
	const navigate = useNavigate();
	const [showTrailer, setShowTrailer] = useState(false);

	const handleOpenTrailer = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowTrailer(true);
	};

	const handleCloseTrailer = () => setShowTrailer(false);

	const handleNavigate = () => {
		const path = config.routes.movie_detail.replace(":slug", String(item.slug));
		navigate(path);
	};

	return (
		<div
			className={clsx(styles["carousel-item-wrapper"])}
			onClick={handleNavigate}
		>
			<div className={clsx(styles["carousel-item"])}>
				<Image
					src={item.poster_url}
					alt={item.title}
					className={clsx(styles["carousel-image"])}
				/>
				<Badge position="bottom-right" isAgeRating>
					{item.age_rating}
				</Badge>
				<div className={clsx(styles["carousel-overlay"])}>
					<Button
						className={clsx(styles["carousel-btn"])}
						primary
						leftIcon={<ConfirmationNumber />}
					>
						Mua vé
					</Button>
					<Button
						className={clsx(
							styles["carousel-btn"],
							styles["carousel-btn-outline"]
						)}
						leftIcon={<PlayCircle />}
						onClick={handleOpenTrailer}
					>
						Trailer
					</Button>
				</div>
			</div>
			<Tooltip title={item.title} arrow placement="bottom">
				<Link to="#" className={clsx(styles["carousel-title"])}>
					{item.title}
				</Link>
			</Tooltip>

			<Tooltip title={item.genres_list} arrow placement="bottom">
				<p className={clsx(styles["carousel-genre"])}>{item.genres_list}</p>
			</Tooltip>

			{showTrailer && (
				<Modal
					isOpen={showTrailer}
					onClose={handleCloseTrailer}
					aria-labelledby="movie-trailer"
					width={1000}
					height={563}
				>
					<Box>
						<iframe
							src={getYoutubeEmbedUrl(item.trailer_url)}
							title={`${item.title} Trailer`}
							width="100%"
							height="100%"
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
