import { createContext, useState, ReactNode } from "react";

interface SnackbarContextType {
	showSnackbar: (
		message: string,
		severity?: "success" | "error" | "warning" | "info"
	) => void;
	closeSnackbar: () => void;
	message: string | null;
	severity: "success" | "error" | "warning" | "info";
	open: boolean;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [severity, setSeverity] = useState<
		"success" | "error" | "warning" | "info"
	>("success");

	const showSnackbar = (
		message: string,
		severity: "success" | "error" | "warning" | "info" = "success"
	) => {
		setMessage(message);
		setSeverity(severity);
		setOpen(true);
	};

	const closeSnackbar = () => {
		setOpen(false);
	};

	return (
		<SnackbarContext.Provider
			value={{ showSnackbar, closeSnackbar, message, severity, open }}
		>
			{children}
		</SnackbarContext.Provider>
	);
};
