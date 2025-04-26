import { useEffect, useState, useRef } from "react";
import { Menu, ExpandLess, ExpandMore, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./Header.module.scss";
import { authService } from "@/services/";
import { UserProps } from "@/types/";
import { Button, Image } from "@/components";

interface HeaderProps {
	onCollapse: () => void;
}

const Header = ({ onCollapse }: HeaderProps) => {
	const [isCollapse, setIsCollapse] = useState(false);
	const [userData, setUserData] = useState<UserProps | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user = await authService.getCurrentUser();
				setUserData(user);
			} catch (error) {
				console.error("Có lỗi xảy ra trong quá trình tải người dùng:", error);
			}
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		// Xử lý click outside để đóng dropdown
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsCollapse(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = async () => {
		try {
			await authService.logout();
			navigate("");
		} catch (error) {
			console.error("Lỗi đăng xuất:", error);
		}
	};

	return (
		<header className={clsx(styles["header"])}>
			<div className={clsx(styles["header-wrapper"])}>
				<div className={clsx(styles["header-left"])}>
					<Button
						className={styles["btn-collapse"]}
						size="no-padding"
						outline
						onClick={onCollapse}
					>
						<Menu />
					</Button>
				</div>
				<div className={clsx(styles["header-right"])} ref={dropdownRef}>
					<Image
						src="https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-9/65295805_2372729606341366_716438740116963328_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEsgg4mi3rNQKi2YsObsX9kMC4eEgeLOtMwLh4SB4s607uzr-8MVEI7cZ_f0bSf7Ym_wQSbSTENPctr7Ao6FjNq&_nc_ohc=bkbtBCtWeOAQ7kNvwH_8jZF&_nc_oc=Adms5FvuqW7aX7owz_gOzfZpEBdLVP2shzTlb5j7tIGDixiZBpHZWBM4Q92-onZUhi0&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&_nc_gid=qqDgGvRGjslK0wll-cQY3w&oh=00_AfEm4WJJQOZ5OqMl28IvqS62JSHI_LOicDSiy_-HGOEgvQ&oe=68197C6F"
						alt="avatar"
						className={clsx(styles["header-avatar"])}
					/>
					<Button
						className={clsx(styles["header-btn"])}
						onClick={() => setIsCollapse(!isCollapse)}
						rightIcon={isCollapse ? <ExpandLess /> : <ExpandMore />}
						size="no-padding"
						text
					>
						{userData?.name || "Admin"}
					</Button>

					{/* Dropdown menu */}
					{isCollapse && (
						<div className={clsx(styles["dropdown-menu"])}>
							<ul className={clsx(styles["dropdown-list"])}>
								<li className={clsx(styles["dropdown-item"])}>
									<Button
										leftIcon={<Logout />}
										className={clsx(
											styles["dropdown-btn"],
											styles["dropdown-btn-logout"]
										)}
										onClick={handleLogout}
										text
										size="small"
									>
										Đăng xuất
									</Button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
