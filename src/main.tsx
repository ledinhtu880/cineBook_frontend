// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GlobalStyles } from "@/components";
import { SnackbarProvider } from "./context/SnackbarContext.tsx";

createRoot(document.getElementById("root")!).render(
	<GlobalStyles>
		<SnackbarProvider>
			<App />
		</SnackbarProvider>
	</GlobalStyles>
);
