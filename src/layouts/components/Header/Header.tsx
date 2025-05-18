import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Person, Search, KeyboardArrowDown } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Header.module.scss";
import config from "@/config";
import { useAuth } from "@/hooks";
import { Button, Container, Input } from "@/components";

const Header = () => {
	const navigate = useNavigate();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const {
		isLoggedIn,
		setIsLoginOpen,
		setIsRegisterOpen,
		handleLogout,
		renderLoginModals,
		user,
	} = useAuth();

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className={clsx(styles.header)}>
				<Container>
					<nav className={clsx(styles.nav)}>
						<div className={clsx(styles["left-section"])}>
							<Link to={config.routes.home} className={clsx(styles.logo)}>
								🎬 CineBook
							</Link>
						</div>
						<div className={clsx(styles["mid-section"])}>
							<Button
								className={clsx(styles.btn)}
								to={config.routes.now_showing}
							>
								Phim đang chiếu
							</Button>
							<Button
								className={clsx(styles.btn)}
								to={config.routes.coming_soon}
							>
								Phim sắp chiếu
							</Button>
							<Button className={clsx(styles.btn)} to={config.routes.cinema}>
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
								<div
									className={clsx(styles["user-dropdown"])}
									ref={dropdownRef}
								>
									<div
										className={clsx(styles["user-button"])}
										onClick={toggleDropdown}
									>
										<Person className={clsx(styles["user-icon"])} />
										<span className={clsx(styles["username"])}>
											{user?.name}
										</span>
										<KeyboardArrowDown
											className={clsx(styles["dropdown-arrow"])}
										/>
									</div>
									{isDropdownOpen && (
										<div className={clsx(styles["dropdown-menu"])}>
											<Link
												to={config.routes.profile}
												className={clsx(styles["dropdown-item"])}
											>
												Tài khoản
											</Link>
											<button
												onClick={handleLogout}
												className={clsx(styles["dropdown-item"])}
											>
												Đăng xuất
											</button>
										</div>
									)}
								</div>
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
			{renderLoginModals(true)}
		</>
	);
};

export default Header;
