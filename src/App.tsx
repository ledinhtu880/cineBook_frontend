import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedAdminRoute from "@components/ProtectedAdminRoute/index";
import { publicRoutes, adminRoutes } from "./routes";
import DefaultLayout from "@layouts/DefaultLayout";
import AdminLayout from "@layouts/AdminLayout";

const App = () => {
	return (
		<Router>
			<Routes>
				{publicRoutes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={
							<DefaultLayout>
								<route.component />
							</DefaultLayout>
						}
					/>
				))}
				{adminRoutes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<route.component />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>
				))}
			</Routes>
		</Router>
	);
};

export default App;
