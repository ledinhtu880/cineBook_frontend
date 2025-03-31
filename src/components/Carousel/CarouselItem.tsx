import clsx from "clsx";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Link } from "react-router-dom";

import styles from "./Carousel.module.scss";
import { MovieProps } from "@/types/index";
import Image from "@/components/Image";

const CarouselItem = ({ item }: { item: MovieProps }) => {
	return (
		<div className={clsx(styles["carousel-item-wrapper"])}>
			<div key={item.id} className={clsx(styles["carousel-item"])}>
				<Image
					src={item.poster_url}
					alt={item.title}
					className={clsx(styles["carousel-image"])}
				/>
				<div className={clsx(styles["carousel-badge"])}>
					<span>{item.age_rating}</span>
				</div>
			</div>
			<h3>
				<Tippy content={item.title} placement="bottom">
					<Link
						to="#"
						className={clsx(styles["carousel-title"])}
						title={item.title}
					>
						{item.title}
					</Link>
				</Tippy>
			</h3>
		</div>
	);
};

export default CarouselItem;
