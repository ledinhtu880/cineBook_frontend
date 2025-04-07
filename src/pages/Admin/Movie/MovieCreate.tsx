import PageWrapper from "@/components/PageWrapper";
import Card from "@/components/Card";
import MovieForm from "./MovieForm";
import { movieService } from "@/services";

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
