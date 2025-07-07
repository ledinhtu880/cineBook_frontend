import { Link } from "react-router-dom";
import {
	Facebook,
	Instagram,
	Twitter,
	YouTube,
	LocationOn,
	Phone,
	Mail,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Footer.module.scss";
import config from "@/config";

const Footer = () => {
	return (
		<footer className={clsx(styles["footer"])}>
			<div className={clsx(styles["wrapper"])}>
				<div className={clsx(styles["wrapper-grid"])}>
					<div className={clsx(styles["section"])}>
						<Link to={config.routes.home} className={clsx(styles["logo"])}>
							🎬 CineBook
						</Link>
						<p className={clsx(styles["description"])}>
							Cinebook là nền tảng đặt vé xem phim trực tuyến hàng đầu, cung cấp
							trải nghiệm đặt vé dễ dàng và thuận tiện cho người dùng.
						</p>
						<div className={clsx(styles["social-list"])}>
							<div className={clsx(styles["social-list"])}>
								<Link
									to="#"
									className={styles["social-link"]}
									aria-label="Theo dõi CineBook trên Facebook"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Facebook fontSize="small" />
									<span>Facebook</span>
								</Link>

								<Link
									to="#"
									className={styles["social-link"]}
									aria-label="Theo dõi CineBook trên Instagram"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Instagram fontSize="small" />
									<span>Instagram</span>
								</Link>

								<Link
									to="#"
									className={styles["social-link"]}
									aria-label="Theo dõi CineBook trên Twitter"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Twitter fontSize="small" />
									<span>Twitter</span>
								</Link>

								<Link
									to="#"
									className={styles["social-link"]}
									aria-label="Đăng ký kênh CineBook trên YouTube"
									target="_blank"
									rel="noopener noreferrer"
								>
									<YouTube fontSize="small" />
									<span>Youtube</span>
								</Link>
							</div>
						</div>
					</div>

					<div className={clsx(styles["section"])}>
						<h3 className={clsx(styles["heading"])}>Liên kết nhanh</h3>
						<ul className={clsx(styles["list"])}>
							<li>
								<Link to="/now-showing" className={clsx(styles["list-item"])}>
									Phim đang chiếu
								</Link>
							</li>
							<li>
								<Link to="/coming-soon" className={clsx(styles["list-item"])}>
									Phim sắp chiếu
								</Link>
							</li>
							<li>
								<Link to="/theaters" className={clsx(styles["list-item"])}>
									Hệ thống rạp
								</Link>
							</li>
							<li>
								<Link to="/promotions" className={clsx(styles["list-item"])}>
									Khuyến mãi
								</Link>
							</li>
							<li>
								<Link to="/news" className={clsx(styles["list-item"])}>
									Tin tức
								</Link>
							</li>
						</ul>
					</div>

					<div className={clsx(styles["section"])}>
						<h3 className={clsx(styles["heading"])}>Chính sách</h3>
						<ul className={clsx(styles["list"])}>
							<li>
								<Link to="/terms" className={clsx(styles["list-item"])}>
									Điều khoản sử dụng
								</Link>
							</li>
							<li>
								<Link to="/privacy" className={clsx(styles["list-item"])}>
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link to="/payment" className={clsx(styles["list-item"])}>
									Chính sách thanh toán
								</Link>
							</li>
							<li>
								<Link to="/faq" className={clsx(styles["list-item"])}>
									Câu hỏi thường gặp
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className={clsx(styles["section"])}>
						<h3 className={clsx(styles["heading"])}>Liên hệ</h3>
						<ul className={clsx(styles["contact"])}>
							<li>
								<LocationOn className={clsx(styles["icon"])} />
								<span>175 Tây Sơn, Phường Kim Liên, Hà Nội</span>
							</li>
							<li>
								<Phone className={clsx(styles["icon"])} />
								<span>0865176605</span>
							</li>
							<li>
								<Mail className={clsx(styles["icon"])} />
								<span>ledinhtu880@gmail.com</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className={clsx(styles["copyright"])}>
					<p>
						&copy; {new Date().getFullYear()} Cinebook. Tất cả quyền được bảo
						lưu.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
