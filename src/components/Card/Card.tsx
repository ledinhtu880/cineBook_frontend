import { Tune, Search } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Card.module.scss";
import Input from "@components/Input";

interface CardProps {
	title: string;
	action?: boolean;
	children?: React.ReactNode;
	onSearch?: (value: string) => void;
}

const Card = ({ title, action, children, onSearch }: CardProps) => {
	return (
		<div className={clsx(styles["card"])}>
			{/* Start: Card Header */}
			<div className={clsx(styles["card-header"])}>
				<h3 className={clsx(styles["card-title"])}>{title}</h3>

				{action && (
					<div className={clsx(styles["card-header-actions"])}>
						{/* Search */}
						<div className={clsx(styles["card-header-search"])}>
							<Search className="text-gray-500" />
							<Input
								placeholder="Tìm kiếm..."
								className={clsx(styles["card-header-input"])}
								onChange={(e) => onSearch?.(e.target.value)}
							/>
						</div>
						{/* Filter Button */}
						<button className={clsx(styles["card-header-filter"])}>
							<Tune />
							Lọc
						</button>
					</div>
				)}
			</div>
			{/* Start: End Header */}

			<div className={clsx(styles["card-body"])}>{children}</div>
		</div>
	);
};

export default Card;
