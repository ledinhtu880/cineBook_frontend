import { ReactNode } from "react";
import { Modal as MuiModal, Box } from "@mui/material";
import clsx from "clsx";
import styles from "./Modal.module.scss";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	width?: number;
	children: ReactNode;
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	width = 400,
}: ModalProps) => {
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: width,
		bgcolor: "background.paper",
		borderRadius: "4px",
		boxShadow: 24,
		p: 3,
	};

	return (
		<MuiModal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="modal-title"
			tabIndex={-1}
		>
			<Box sx={style}>
				{title && (
					<div className={clsx(styles["modal-header"])}>
						<h3 className={clsx(styles["modal-title"])} id="modal-title">
							{title}
						</h3>
					</div>
				)}
				<div className={clsx(styles["modal-body"])}>{children}</div>
			</Box>
		</MuiModal>
	);
};

export default Modal;
