import { useEffect } from "react";
import clsx from "clsx";

import styles from "../Auth.module.scss";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onRegisterSuccess: () => void;
}

const RegisterSuccessModal = ({
	isOpen,
	onClose,
	onRegisterSuccess,
}: RegisterModalProps) => {
	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				onRegisterSuccess();
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [isOpen, onRegisterSuccess]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} width={450} >
			<Image
				alt="Icon Login"
				loading="lazy"
				className={clsx(styles["form-img"])}
				src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
			/>
			<h5 className={styles.title}>Đăng ký thành công</h5>
			<div className={clsx(styles.circle)}>
				<FontAwesomeIcon icon={faCheck} size="2x" />
			</div>
			<p className={styles.welcome}>Chào mừng bạn đến với CineBook</p>
		</Modal>
	);
};

export default RegisterSuccessModal;
