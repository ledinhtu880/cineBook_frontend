import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationOn, Phone, AccessTime } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Cinema.module.scss";
import { CinemaData, CityProps } from "@/types";
import { cityService } from "@/services";
import { Container, Select, Loading, Image, Button } from "@/components";
import config from "@/config";

const Cinema = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [cities, setCities] = useState<CityProps[]>([]);
	const [selectedCity, setSelectedCity] = useState<CityProps | null>(null);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const cityId = Number(event.target.value);
		const city = cities.find((city) => city.id === cityId);
		if (city) setSelectedCity(city);
	};

	const handleClick = (cinema: CinemaData) => {
		navigate(config.routes.cinema_detail.replace(":slug", String(cinema.slug)));
	};

	const cinemas = selectedCity?.cinemas || [];

	useEffect(() => {
		(async () => {
			try {
				const response = await cityService.getWithCinemas();

				setCities(response);

				if (response && response.length > 0) {
					setSelectedCity(response[0]);
				}
			} catch (log) {
				console.error("Có lỗi khi lấy thành phố:", log);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading || !selectedCity) return <Loading absolute />;

	return (
		<Container className="py-8 min-vh-100">
			<div className={clsx(styles.header)}>
				<h4 className={clsx(styles.title, "border-left-accent")}>
					rạp chiếu phim
				</h4>

				<div className={clsx(styles["filter-wrapper"])}>
					<label htmlFor="selected_city" className="font-medium">
						Chọn thành phố
					</label>
					<Select
						id="selected_city"
						className={clsx(styles["filter-select"])}
						value={selectedCity.id}
						onChange={handleChange}
					>
						{cities.map((city) => (
							<option key={city.id} value={city.id}>
								{city.name}
							</option>
						))}
					</Select>
				</div>
			</div>

			<div className={clsx(styles["cinema-list"])}>
				{cinemas.length > 0 ? (
					cinemas.map((cinema) => (
						<div key={cinema.id} className={clsx(styles["cinema-card"])}>
							<div className={clsx(styles["cinema-image"])}>
								<Image src={cinema.image} alt={cinema.name} />
							</div>
							<div className={clsx(styles["cinema-info"])}>
								<h2 className={clsx(styles["cinema-name"])}>{cinema.name}</h2>
								<p className={clsx(styles["cinema-value"])}>
									<LocationOn className={clsx(styles["icon"])} />{" "}
									{cinema.address}
								</p>
								<p className={clsx(styles["cinema-value"])}>
									<Phone className={clsx(styles["icon"])} /> {cinema.phone}
								</p>
								<p className={clsx(styles["cinema-value"])}>
									<AccessTime className={clsx(styles["icon"])} />{" "}
									{cinema.opening_hours}
								</p>
								<div>
									<Button primary onClick={() => handleClick(cinema)}>
										Xem lịch chiếu
									</Button>
								</div>
							</div>
						</div>
					))
				) : (
					<div className={clsx("empty")}>
						<p>Không có rạp chiếu phim nào tại {selectedCity.name}</p>
					</div>
				)}
			</div>
		</Container>
	);
};

export default Cinema;
