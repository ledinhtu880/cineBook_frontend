import MovieForm from "./MovieForm";
import { movieService } from "@/services";
import { Card, PageWrapper } from "@/components";

const MovieCreate = () => {
	return (
		<PageWrapper title="Thêm mới phim">
			<Card>
				<MovieForm mode="create" onSubmit={movieService.create} />
			</Card>
		</PageWrapper>
	);
};

export default MovieCreate;
