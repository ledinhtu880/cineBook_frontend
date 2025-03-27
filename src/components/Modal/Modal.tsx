import { ReactNode } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div
			className={clsx(styles.overlay)}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			onClick={(e) => e.stopPropagation()}
		>
			<div className={clsx(styles.wrapper)}>
				<div className={clsx(styles["modal-dialog"])}>
					<div className={clsx(styles["modal-content"])}>
						<div className={clsx(styles["modal-header"])}>
							<h3 className={clsx(styles["modal-title"])} id="modal-title">
								{title}
							</h3>
							<button
								type="button"
								className={clsx(styles["close-btn"])}
								onClick={onClose}
								aria-label="Close modal"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div className={clsx(styles["modal-body"])}>{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
