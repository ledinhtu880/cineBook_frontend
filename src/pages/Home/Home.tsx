import * as hooks from "@hooks/index";

const Home = () => {
	hooks.useDocumentTitle("Trang chủ");
	return <div>Trang chủ</div>;
};

export default Home;
