import clsx from "clsx";

import styles from "./NotFoundPage.module.scss";
import { Container } from "@/components";

const NotFoundPage = () => {
	return (
		<div className={clsx(styles.wrapper)}>
			<Container className={clsx("px-4", "py-8")}>
				<div className={clsx(styles.main)}>
					<div className={clsx(styles.text)}>
						<h1>404</h1>
						<p className={clsx(styles.message)}>
							Rất tiếc, trang bạn đang tìm kiếm không tồn tại
						</p>
						<p className={clsx(styles.submessage)}>
							Có thể trang đã bị xóa hoặc địa chỉ URL không chính xác
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default NotFoundPage;
