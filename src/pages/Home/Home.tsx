import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import clsx from "clsx";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./Home.module.scss";
import { movieService } from "@/services";
import { MovieProps } from "@/types";
import { Image, Carousel } from "@/components";

const Home = () => {
	const [topRatedMovies, setTopRatedMovies] = useState<MovieProps[]>([]);
	useEffect(() => {
		(async () => {
			try {
				const response = await movieService.getTopRatedNowShowingMovies({
					limit: 5,
					sort: "rating",
					order: "desc",
				});
				setTopRatedMovies(response);
			} catch (error) {
				console.error("Failed to fetch top-rated movies:", error);
			}
		})();
	}, []);

	return (
		<div className={clsx(styles.wrapper)}>
			{/* Start: Slider */}
			<div className={clsx(styles.slider)}>
				<Swiper
					modules={[Navigation, Autoplay, Pagination]}
					spaceBetween={0}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					className={clsx(styles.swiper)}
				>
					{topRatedMovies.map((banner) => (
						<SwiperSlide key={banner.id}>
							<Image
								src={banner.banner_url}
								alt={banner.title}
								className={clsx(styles.sliderImage)}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			{/* End: Slider */}

			{/* Start: Now Showing */}
			<Carousel
				title="Phim đang chiếu"
				fetchData={movieService.getNowShowingMovies}
				hasBackground
			/>
			{/* End: Now Showing */}

			{/* Start: Coming soon */}
			<Carousel
				title="Phim sắp chiếu"
				fetchData={movieService.getComingSoonMovies}
			/>
			{/* End: Coming son */}
		</div>
	);
};

export default Home;
