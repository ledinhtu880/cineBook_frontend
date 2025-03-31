import clsx from "clsx";
import styles from "./Carousel.module.scss";
import { MovieProps } from "@/types/index";
import Image from "@/components/Image";

const CarouselItem = ({ item }: { item: MovieProps }) => {
	return (
		<div key={item.id} className={clsx(styles["carousel-item"])}>
			<Image
				src={item.poster_url}
				alt={item.title}
				className={clsx(styles["carousel-image"])}
			/>
			<h3 className={clsx(styles["carousel-title"])}>{item.title}</h3>
		</div>
	);
};

export default CarouselItem;
