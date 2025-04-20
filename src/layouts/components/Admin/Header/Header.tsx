import { useEffect, useState } from "react";
import { Menu } from "@mui/icons-material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Header.module.scss";
import { User, authService } from "@/services/";
import { Button, Image } from "@/components";

interface HeaderProps {
	onCollapse: () => void;
}

const Header = ({ onCollapse }: HeaderProps) => {
	const [isCollapse, setIsCollapse] = useState(false);
	const [userData, setUserData] = useState<User | null>(null);

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
	}, [userData]);

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
				<div className={clsx(styles["header-right"])}>
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
						{userData?.name}
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
