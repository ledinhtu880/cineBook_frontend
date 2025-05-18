import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./MovieItem.module.scss";
import config from "@/config";
import type { MovieProps } from "@/types";
import { MovieCard, Container } from "@/components";

interface Props {
	movies: MovieProps[];
	handleClick: (movie: MovieProps) => void;
}

type MovieTab = "now-showing" | "coming-soon";

const MovieItem: React.FC<Props> = ({ movies, handleClick }) => {
	const navigate = useNavigate();
	const nowShowingUrl = config.routes.now_showing;
	const comingSoonUrl = config.routes.coming_soon;

	// Sử dụng type MovieTab
	const [activeTab, setActiveTab] = useState<MovieTab>("now-showing");

	const handleTabChange = (tab: MovieTab) => {
		setActiveTab(tab);

		// Navigation to the appropriate page
		if (tab === "now-showing") {
			navigate(nowShowingUrl);
		} else {
			navigate(comingSoonUrl);
		}
	};

	useEffect(() => {
		// Set the active tab based on the current URL
		if (window.location.pathname === nowShowingUrl) {
			setActiveTab("now-showing");
		} else if (window.location.pathname === comingSoonUrl) {
			setActiveTab("coming-soon");
		}
	}, [nowShowingUrl, comingSoonUrl]);

	return (
		<Container className={clsx(styles.wrapper)}>
			<div className={clsx(styles.header)}>
				<h4 className={clsx(styles["header-title"], "border-left-accent")}>
					Phim
				</h4>

				<div className={clsx(styles["movie-tabs"])}>
					<button
						className={clsx(
							styles["tab-item"],
							activeTab === "now-showing"
								? styles["tab-active"]
								: styles["tab-inactive"]
						)}
						onClick={() => handleTabChange("now-showing")}
					>
						Đang chiếu
					</button>

					<button
						className={clsx(
							styles["tab-item"],
							activeTab === "coming-soon"
								? styles["tab-active"]
								: styles["tab-inactive"]
						)}
						onClick={() => handleTabChange("coming-soon")}
					>
						Sắp chiếu
					</button>
				</div>
			</div>

			<div className={clsx(styles["movie-wrapper"])}>
				{movies.map((movie) => (
					<MovieCard
						key={movie.id}
						movie={movie}
						onClick={() => handleClick(movie)}
					/>
				))}
			</div>

			{movies.length === 0 && (
				<div className={clsx("empty")}>
					<p>Không có phim nào đang chiếu</p>
				</div>
			)}
		</Container>
	);
};

export default MovieItem;
