import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout/";

const App = () => {
	return (
		<Router>
			<div>
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
			</div>
		</Router>
	);
};

export default App;
