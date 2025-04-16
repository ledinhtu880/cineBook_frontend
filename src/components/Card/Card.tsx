import { useNavigate } from "react-router-dom";
import { Search, Add } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Card.module.scss";
import { Input, Button } from "@/components";

interface CardProps {
	title?: string;
	action?: boolean;
	children?: React.ReactNode;
	addLabel?: string;
	addPath?: string;
	onAdd?: () => void;
	searchLabel?: string;
	searchValue?: string;
	onSearch?: (value: string) => void;
}

const Card = ({
	title,
	action,
	children,
	addLabel,
	addPath,
	onAdd,
	searchLabel,
	onSearch,
	searchValue,
}: CardProps) => {
	const navigate = useNavigate();
	const handleAdd = () => {
		if (onAdd) {
			onAdd();
		} else if (addPath) {
			navigate(addPath);
		}
	};

	return (
		<div className={clsx(styles["card"])}>
			{/* Start: Card Header */}
			{title && (
				<div className={clsx(styles["card-header"])}>
					<h3 className={clsx(styles["card-title"])}>{title}</h3>

					{(action || onAdd || addLabel || onSearch) && (
						<div className={clsx(styles["card-header-actions"])}>
							{/* Search */}
							{onSearch && (
								<div className={clsx(styles["card-header-search"])}>
									<Search className="text-gray-500" />
									<Input
										placeholder={searchLabel || "Tìm kiếm..."}
										className={clsx(styles["card-header-input"])}
										onChange={(e) => onSearch?.(e.target.value)}
										value={searchValue}
									/>
								</div>
							)}

							{/* Add Button */}
							{addLabel && (addPath || onAdd) ? (
								<Button primary leftIcon={<Add />} onClick={handleAdd}>
									{addLabel}
								</Button>
							) : null}
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
