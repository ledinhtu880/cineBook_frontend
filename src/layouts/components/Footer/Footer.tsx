import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Footer.module.scss";
import config from "@/config";

const Footer = () => {
	return (
		<footer className="bg-white border-t border-gray-200">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Logo and About */}
					<div className="col-span-1">
						<div className="mb-4">
							<Link to={config.routes.home} className={clsx(styles.logo)}>
								🎬 CineBook
							</Link>
						</div>
						<p className="text-gray-600 text-sm mb-4">
							Cinebook là nền tảng đặt vé xem phim trực tuyến hàng đầu, cung cấp
							trải nghiệm đặt vé dễ dàng và thuận tiện cho người dùng.
						</p>
						<div className="flex space-x-4">
							<Link to="#" className="text-gray-500 hover:text-[#144184]">
								<Facebook fontSize="small" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link to="#" className="text-gray-500 hover:text-[#144184]">
								<Instagram fontSize="small" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link to="#" className="text-gray-500 hover:text-[#144184]">
								<Twitter fontSize="small" />
								<span className="sr-only">Twitter</span>
							</Link>
							<Link to="#" className="text-gray-500 hover:text-[#144184]">
								<YouTube fontSize="small" />
								<span className="sr-only">Youtube</span>
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<div className="col-span-1">
						<h3 className="font-bold text-[#144184] mb-4">Liên kết nhanh</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/now-showing"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Phim đang chiếu
								</Link>
							</li>
							<li>
								<Link
									to="/coming-soon"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Phim sắp chiếu
								</Link>
							</li>
							<li>
								<Link
									to="/theaters"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Hệ thống rạp
								</Link>
							</li>
							<li>
								<Link
									to="/promotions"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Khuyến mãi
								</Link>
							</li>
							<li>
								<Link
									to="/news"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Tin tức
								</Link>
							</li>
						</ul>
					</div>

					{/* Policies */}
					<div className="col-span-1">
						<h3 className="font-bold text-[#144184] mb-4">Chính sách</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/terms"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Điều khoản sử dụng
								</Link>
							</li>
							<li>
								<Link
									to="/privacy"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link
									to="/payment"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Chính sách thanh toán
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-600 hover:text-[#144184] text-sm"
								>
									Câu hỏi thường gặp
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					{/* <div className="col-span-1">
						<h3 className="font-bold text-[#144184] mb-4">Liên hệ</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<LocationOn className="h-5 w-5 text-[#144184] mr-2 shrink-0 mt-0.5" />
								<span className="text-gray-600 text-sm">
									Tầng 5, Tòa nhà Cinema, 123 Đường Phim, Quận 1, TP. Hồ Chí
									Minh
								</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-5 w-5 text-[#144184] mr-2" />
								<span className="text-gray-600 text-sm">0123 456 789</span>
							</li>
							<li className="flex items-center">
								<Mail className="h-5 w-5 text-[#144184] mr-2" />
								<span className="text-gray-600 text-sm">
									support@cinebook.com
								</span>
							</li>
						</ul>
					</div> */}
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-6 border-t border-gray-200 text-center">
					<p className="text-gray-500 text-sm">
						&copy; {new Date().getFullYear()} Cinebook. Tất cả quyền được bảo
						lưu.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
