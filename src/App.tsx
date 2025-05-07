import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

import { useSnackbar } from "@/context";
import AdminLayout from "@/layouts/AdminLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { publicRoutes, adminRoutes, privateRoutes } from "./routes";
import ProtectedUserRoute from "@/components/ProtectedUserRoute";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { NotFoundPage } from "./pages";

const App = () => {
	const { open, message, severity, closeSnackbar } = useSnackbar();

	return (
		<>
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
					{privateRoutes.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							element={
								<ProtectedUserRoute>
									<DefaultLayout>
										<route.component />
									</DefaultLayout>
								</ProtectedUserRoute>
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

					<Route
						path="*"
						element={
							<DefaultLayout>
								<NotFoundPage />
							</DefaultLayout>
						}
					/>
				</Routes>
			</Router>

			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={closeSnackbar}
					severity={severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default App;
