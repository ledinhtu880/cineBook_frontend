import { Search, Add } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Card.module.scss";
import { Input, Button } from "@components/index";

interface CardProps {
	title?: string;
	action?: boolean;
	children?: React.ReactNode;
	addLabel?: string; // Add this
	addPath?: string; // Add this
	searchLabel?: string; // Add this
	onSearch?: (value: string) => void;
}

const Card = ({
	title,
	action,
	children,
	addLabel,
	addPath,
	searchLabel,
	onSearch,
}: CardProps) => {
	return (
		<div className={clsx(styles["card"])}>
			{/* Start: Card Header */}
			{title && (
				<div className={clsx(styles["card-header"])}>
					<h3 className={clsx(styles["card-title"])}>{title}</h3>

					{(action || addPath || onSearch) && (
						<div className={clsx(styles["card-header-actions"])}>
							{/* Search */}
							{onSearch && (
								<div className={clsx(styles["card-header-search"])}>
									<Search className="text-gray-500" />
									<Input
										placeholder={searchLabel || "Tìm kiếm..."}
										className={clsx(styles["card-header-input"])}
										onChange={(e) => onSearch?.(e.target.value)}
									/>
								</div>
							)}
							{/* Filter Button
							<button className={clsx(styles["card-header-filter"])}>
								<Tune />
								Lọc
							</button> */}

							{/* Add Button */}
							{addPath && (
								<Button to={addPath} leftIcon={<Add />} primary>
									{addLabel}
								</Button>
							)}
						</div>
					)}
				</div>
			)}
			{/* Start: End Header */}

			<div className={clsx(styles["card-body"])}>{children}</div>
		</div>
	);
};

export default Card;
