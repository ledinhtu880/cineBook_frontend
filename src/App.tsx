import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout/";

const App = () => {
	return (
		<Router>
			<Routes>
				{publicRoutes.map((route, index) => {
					return (
						<Route
							key={index}
							path={route.path}
							element={
								<DefaultLayout>
									<route.component />
								</DefaultLayout>
							}
						/>
					);
				})}
			</Routes>
		</Router>
	);
};

export default App;
