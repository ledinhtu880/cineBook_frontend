import CinemaForm from "./CinemaForm";
import { cinemaService } from "@/services";
import { PageWrapper, Card } from "@/components";

const CinemaCreate = () => {
	return (
		<PageWrapper title="Thêm rạp chiếu phim">
			<Card>
				<CinemaForm mode="create" onSubmit={cinemaService.create} />
			</Card>
		</PageWrapper>
	);
};

export default CinemaCreate;
