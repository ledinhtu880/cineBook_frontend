import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Person, Search } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Header.module.scss";
import config from "@/config";
import { useAuth } from "@/hooks";
import { Button, Container, Input } from "@/components";

const Header = () => {
	const navigate = useNavigate();

	const {
		isLoggedIn,
		setIsLoginOpen,
		setIsRegisterOpen,
		handleLogout,
		LoginModalComponent,
	} = useAuth();

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (searchValue.trim()) {
				navigate(
					`${config.routes.search}?q=${encodeURIComponent(searchValue.trim())}`
				);
			} else {
				setIsSearchOpen(false);
			}
		}
	};

	return (
		<>
			<header className={clsx(styles.header)}>
				<Container>
					<nav className={clsx(styles.nav)}>
						<div className={clsx(styles["left-section"])}>
							<Link to={config.routes.home} className={styles.logo}>
								🎬 CineBook
							</Link>
						</div>
						<div className={clsx(styles["mid-section"])}>
							<Button className={styles.btn} to={config.routes.now_showing}>
								Phim đang chiếu
							</Button>
							<Button className={styles.btn} to={config.routes.coming_soon}>
								Phim sắp chiếu
							</Button>
							<Button className={styles.btn} to={config.routes.cinema}>
								Hệ thống rạp
							</Button>
						</div>
						<div className={clsx(styles["right-section"])}>
							{isSearchOpen ? (
								<div className={clsx(styles["input-search-wrapper"])}>
									<Input
										className={clsx(styles["input-search"])}
										placeholder="Tìm kiếm phim..."
										autoFocus
										onBlur={() => setIsSearchOpen(false)}
										onChange={(e) => setSearchValue(e.target.value)}
										onKeyDown={handleSearch}
									/>
									<Search className="w-4 h-4 text-gray-500 cursor-pointer" />
								</div>
							) : (
								<Button
									size="no-padding"
									className={clsx(styles["btn-search"])}
									onClick={() => setIsSearchOpen(true)}
								>
									<Search />
								</Button>
							)}
							{isLoggedIn ? (
								<Button
									className={clsx(styles["btn-sm"])}
									outline
									onClick={handleLogout}
								>
									Đăng xuất
								</Button>
							) : (
								<div className={clsx(styles["btn-group"])}>
									<Button
										leftIcon={<Person fontSize="small" />}
										className={clsx(styles["btn-sm"])}
										outline
										onClick={() => setIsLoginOpen(true)}
									>
										Đăng nhập
									</Button>
									<Button
										className={clsx(styles["btn-sm"])}
										primary
										onClick={() => setIsRegisterOpen(true)}
									>
										Đăng ký
									</Button>
								</div>
							)}
						</div>
					</nav>
				</Container>
			</header>

			<LoginModalComponent />
		</>
	);
};

export default Header;
