import * as hooks from "@hooks/index";
const NowShowing = () => {
	hooks.useDocumentTitle("Phim đang chiếu");
	return <div>Phim đang chiếu</div>;
};

export default NowShowing;
