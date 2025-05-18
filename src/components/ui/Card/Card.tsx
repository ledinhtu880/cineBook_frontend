import { useNavigate } from "react-router-dom";
import { Search, Add } from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Card.module.scss";
import { Input, Button } from "@/components";

interface CardProps {
	title?: string;
	actionButton?: React.ReactNode;
	children?: React.ReactNode;
	addLabel?: string;
	addPath?: string;
	searchLabel?: string;
	searchValue?: string;
	className?: string;
	onAdd?: () => void;
	onSearch?: (value: string) => void;
}

const Card = ({
	title,
	actionButton,
	children,
	addLabel,
	addPath,
	searchLabel,
	searchValue,
	className,
	onAdd,
	onSearch,
}: CardProps) => {
	const navigate = useNavigate();
	const handleAdd = () => {
		if (onAdd) {
			onAdd();
		} else if (addPath) {
			navigate(addPath);
		}
	};

	const classes = clsx(clsx(styles["card"]), className);

	return (
		<div className={classes}>
			{/* Start: Card Header */}
			{title && (
				<div className={clsx(styles["card-header"])}>
					<h3 className={clsx(styles["card-title"])}>{title}</h3>

					{(actionButton || onAdd || addLabel || onSearch) && (
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

							{/* Action Button */}
							{actionButton && <>{actionButton}</>}
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
