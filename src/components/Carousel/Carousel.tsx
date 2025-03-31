import { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Carousel.module.scss";
import { CarouselProps, MovieProps } from "@/types/index";
import CarouselItem from "./CarouselItem";

const Carousel: React.FC<CarouselProps> = ({ title }) => {
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);

			try {
				const response = await axios.get(
					"http://localhost:8000/api/movies/now-showing"
				);
				setMovies(response.data);
			} catch (error) {
				console.error("Error fetching movies:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, []);

	const handleNext = () => {
		if (currentIndex + 4 < movies.length) {
			setCurrentIndex(currentIndex + 4);
		}
	};

	const handlePrev = () => {
		if (currentIndex - 4 >= 0) {
			setCurrentIndex(currentIndex - 4);
		}
	};

	return (
		<div className={clsx(styles.wrapper)}>
			<h2 className={clsx(styles.title)}>{title}</h2>
			<div className={clsx(styles["carousel-wrapper"])}>
				{isLoading ? (
					<div className={clsx(styles.loading)}>Đang tải...</div>
				) : movies.length === 0 ? (
					<div className={clsx(styles.empty)}>Không có phim nào đang chiếu</div>
				) : (
					<>
						<button
							className={clsx(styles["carousel-control"], styles.prev)}
							onClick={handlePrev}
							disabled={currentIndex === 0}
						>
							<FontAwesomeIcon icon={faChevronLeft} />
						</button>

						<div className={clsx(styles["carousel-track"])}>
							<div className={clsx(styles["carousel-list"])}>
								{movies.map((movie) => (
									<CarouselItem item={movie} key={movie.id} />
								))}
							</div>
						</div>

						<button
							className={clsx(styles["carousel-control"], styles.next)}
							onClick={handleNext}
							disabled={currentIndex + 4 >= movies.length}
						>
							<FontAwesomeIcon icon={faChevronRight} />
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Carousel;
