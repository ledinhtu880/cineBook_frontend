import clsx from "clsx";

import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
	return (
		<div className={clsx(styles.container)}>
			<div className={clsx(styles.content)}>
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
			</div>
		</div>
	);
};

export default NotFoundPage;
