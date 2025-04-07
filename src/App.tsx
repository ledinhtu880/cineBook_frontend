import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

import ProtectedAdminRoute from "@components/ProtectedAdminRoute/index";
import { publicRoutes, adminRoutes } from "./routes";
import DefaultLayout from "@layouts/DefaultLayout";
import AdminLayout from "@layouts/AdminLayout";
import { useSnackbar } from "@/context/";

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
