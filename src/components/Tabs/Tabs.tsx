import clsx from "clsx";

import styles from "./Tabs.module.scss";

interface TabItem<T> {
	key: string | number;
	value: T;
	primary: React.ReactNode;
	secondary?: React.ReactNode;
}

interface TabsProps<T> {
	items: TabItem<T>[];
	selectedValue: T;
	onSelect: (value: T) => void;
	className?: string;
	tabClassName?: string;
	activeTabClassName?: string;
	renderCustomTab?: (
		item: TabItem<T>,
		isSelected: boolean,
		index: number
	) => React.ReactNode;
}

function Tabs<T>({
	items,
	selectedValue,
	onSelect,
	className,
	tabClassName,
	activeTabClassName,
	renderCustomTab,
}: TabsProps<T>) {
	const isSelected = (item: TabItem<T>) => {
		// Xử lý trường hợp Date
		if (selectedValue instanceof Date && item.value instanceof Date) {
			return selectedValue.getTime() === (item.value as Date).getTime();
		}

		// Nếu object có id, so sánh theo id
		if (
			typeof selectedValue === "object" &&
			selectedValue !== null &&
			typeof item.value === "object" &&
			item.value !== null
		) {
			// Kiểm tra nếu có thuộc tính id
			if ("id" in selectedValue && "id" in item.value) {
				return (
					(selectedValue as { id: number }).id ===
					(item.value as { id: number }).id
				);
			}
		}

		// Xử lý các trường hợp khác
		return selectedValue == item.value;
	};

	return (
		<div className={clsx(styles["tabs-container"], className)}>
			{items.map((item, index) => {
				const selected = isSelected(item);

				// Sử dụng renderCustomTab nếu được cung cấp
				if (renderCustomTab) {
					return renderCustomTab(item, selected, index);
				}

				// Mặc định hiển thị
				return (
					<div
						key={item.key}
						className={clsx(
							styles["tab-item"],
							tabClassName,
							selected && [styles["tab-item-active"], activeTabClassName]
						)}
						onClick={() => onSelect(item.value)}
					>
						<span>{item.primary}</span>
						{item.secondary && <span>{item.secondary}</span>}
					</div>
				);
			})}
		</div>
	);
}

export default Tabs;
