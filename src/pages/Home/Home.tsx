import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import * as hooks from "@hooks/index";
import styles from "./Home.module.scss";
import Image from "@/components/Image";
import Carousel from "@/components/Carousel";
import movieService from "@/services/movieService";

const Home = () => {
	hooks.useDocumentTitle("Trang chủ");

	return (
		<div className={clsx(styles.wrapper)} style={{ height: "10000px" }}>
			{/* Start: Slider */}
			<div className={clsx(styles.slider)}>
				<button className={clsx(styles.sliderControl, styles.prev)}>
					<FontAwesomeIcon icon={faChevronLeft} />
				</button>

				<div className={clsx(styles.sliderTrack)}>
					<div className={clsx(styles.sliderSlide)}>
						<Image
							src="https://vcdn1-giaitri.vnecdn.net/2025/03/19/jisoo-1-1742349532-1742349698-5135-1742349805.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=hGqSXJnPiHy3r6XbGozF2Q"
							alt="Title"
							className={clsx(styles.sliderImage)}
						/>
					</div>
				</div>

				<button className={clsx(styles.sliderControl, styles.next)}>
					<i className="fas fa-chevron-right" />
					<FontAwesomeIcon icon={faChevronRight} />
				</button>
			</div>
			{/* Start: End */}

			{/* Start: Now Showing */}
			<Carousel
				title="Phim đang chiếu"
				fetchData={movieService.getNowShowingMovies}
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
