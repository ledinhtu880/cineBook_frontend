import { ReactNode } from "react";
import { Modal as MuiModal, Box } from "@mui/material";
import clsx from "clsx";
import styles from "./Modal.module.scss";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	width?: number | "auto";
	height?: number | "auto";
	customStyle?: object;
	children: ReactNode;
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	width = 400,
	height = "auto",
	customStyle,
}: ModalProps) => {
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: width,
		height: height,
		bgcolor: "background.paper",
		borderRadius: "12px",
		boxShadow: 24,
		overflowY: "auto",
		p: 3,
		"&::-webkit-scrollbar": {
			display: "none",
		},
		msOverflowStyle: "none",
		scrollbarWidth: "none",
	};

	const classes = { ...style, ...customStyle };

	return (
		<MuiModal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
			<Box sx={classes}>
				{title && (
					<div className={clsx(styles["modal-header"])}>
						<h3 className={clsx(styles["modal-title"])} id="modal-title">
							{title}
						</h3>
					</div>
				)}
				{children}
			</Box>
		</MuiModal>
	);
};

export default Modal;
