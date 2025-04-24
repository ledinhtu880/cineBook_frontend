import { useState, useEffect, Suspense, lazy } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Carousel.module.scss";
import { CarouselProps, MovieProps } from "@/types";
import { Loading, Container } from "@/components";

const CarouselItem = lazy(() => import("./CarouselItem"));

const Carousel: React.FC<CarouselProps> = ({
	title,
	fetchData,
	hasBackground = false,
}) => {
	const [movies, setMovies] = useState<MovieProps[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);

			try {
				const moviesData = await fetchData();
				setMovies(moviesData);
			} catch (error) {
				console.error("Error fetching movies:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, [fetchData]);

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
		<div
			className={clsx(styles.wrapper, {
				[styles["has-background"]]: hasBackground,
			})}
		>
			<h2 className={clsx(styles.title)}>{title}</h2>
			<Container>
				{isLoading ? (
					<Loading />
				) : movies.length === 0 ? (
					<div className={clsx("empty")}>
						<p>Không có phim nào đang chiếu</p>
					</div>
				) : (
					<>
						<button
							className={clsx(styles["carousel-control"], styles.prev)}
							onClick={handlePrev}
							disabled={currentIndex === 0}
						>
							<ChevronLeft />
						</button>

						<div className={clsx(styles["carousel-track"])}>
							<div
								className={clsx(styles["carousel-list"])}
								style={{
									transform: `translateX(calc(-${currentIndex} * (var(--item-width) + var(--item-gap))))`,
								}}
							>
								<Suspense fallback={<Loading />}>
									{movies.map((movie) => (
										<CarouselItem item={movie} key={movie.id} />
									))}
								</Suspense>
							</div>
						</div>

						<button
							className={clsx(styles["carousel-control"], styles.next)}
							onClick={handleNext}
							disabled={currentIndex + 4 >= movies.length}
						>
							<ChevronRight />
						</button>
					</>
				)}
			</Container>
		</div>
	);
};

export default Carousel;
