import { useState } from "react";
import {
	Edit,
	Delete,
	Warning,
	KeyboardArrowLeft,
	KeyboardArrowRight,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Table.module.scss";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { Column } from "@/types/";

interface TableProps<T extends { id: number; name?: string; title?: string }> {
	columns: Column<T>[];
	data: T[];
	editPath?: string;
	onDelete?: (record: T) => void;
	pageSize?: number;
}

const Table = <T extends { id: number; name?: string; title?: string }>({
	// Thêm constraint
	columns,
	data,
	editPath,
	onDelete,
	pageSize = 5,
}: TableProps<T>) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<T | null>(null);

	const totalPages = Math.ceil(data.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const currentData = data.slice(startIndex, endIndex);

	return (
		<div>
			<table className={clsx(styles["table"])}>
				<thead className={clsx(styles["table-header"])}>
					<tr>
						{columns.map((column) => (
							<th
								key={String(column.key)}
								className={clsx(styles["table-heading"], {
									"text-left": column.align === "left" || !column.align,
									"text-center": column.align === "center",
									"text-right": column.align === "right",
								})}
							>
								{column.title}
							</th>
						))}
						{(editPath || onDelete) && (
							<th className={clsx(styles["table-heading"], "text-center")}>
								Thao tác
							</th>
						)}
					</tr>
				</thead>
				<tbody className={clsx(styles["table-body"])}>
					{currentData.map((record, index) => {
						return (
							<tr key={index}>
								{columns.map((column) => (
									<td
										key={String(column.key)}
										className={clsx(styles["table-data"], {
											"text-left": column.align === "left" || !column.align,
											"text-center": column.align === "center",
											"text-right": column.align === "right",
										})}
									>
										{column.render
											? column.render(record[column.key], record)
											: String(record[column.key])}
									</td>
								))}
								{(editPath || onDelete) && (
									<td className={clsx(styles["actions-wrapper"])}>
										{editPath && (
											<Button
												to={`${editPath}/${record.id}/edit`}
												size="no-padding"
												className={clsx(styles["actions-btn-edit"])}
											>
												<Edit fontSize="small" />
											</Button>
										)}
										{onDelete && (
											<Button
												onClick={() => {
													setSelectedRecord(record);
													setIsModalOpen(true);
												}}
												size="no-padding"
												className={clsx(styles["actions-btn-delete"])}
											>
												<Delete fontSize="small" />
											</Button>
										)}
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between px-4 py-3 bg-white border-t">
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-700">
						Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
						{data.length} entries
					</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className={clsx(
							"p-2 rounded-lg",
							currentPage === 1
								? "text-gray-400 cursor-not-allowed"
								: "text-gray-700 hover:bg-gray-100"
						)}
					>
						<KeyboardArrowLeft />
					</button>
					{[...Array(totalPages)].map((_, index) => (
						<button
							key={index + 1}
							onClick={() => setCurrentPage(index + 1)}
							className={clsx(
								"px-3 py-1 rounded-lg",
								currentPage === index + 1
									? "bg-[--primary] text-white"
									: "text-gray-700 hover:bg-gray-100"
							)}
						>
							{index + 1}
						</button>
					))}
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
						className={clsx(
							"p-2 rounded-lg",
							currentPage === totalPages
								? "text-gray-400 cursor-not-allowed"
								: "text-gray-700 hover:bg-gray-100"
						)}
					>
						<KeyboardArrowRight />
					</button>
				</div>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedRecord(null);
				}}
				// Bỏ prop title ở đây để không hiển thị header
			>
				{selectedRecord && (
					<>
						<div className={styles["modal-body"]}>
							<div className={styles["warning-message"]}>
								<div className={styles["warning-icon-wrapper"]}>
									<Warning className={styles["warning-icon"]} />
								</div>
								<h3>Bạn có chắc chắn?</h3>
								<p>
									Hành động này không thể hoàn tác. <br />
									Tất cả giá trị liên kết với "
									{selectedRecord.name || selectedRecord.title}" sẽ bị mất.
								</p>
							</div>
						</div>
						<div className={styles["modal-footer"]}>
							<Button
								onClick={() => {
									onDelete?.(selectedRecord);
									setIsModalOpen(false);
									setSelectedRecord(null);
								}}
								className={clsx(styles["btn-delete"])}
								size="small"
							>
								Xóa
							</Button>
							<Button
								onClick={() => {
									setIsModalOpen(false);
									setSelectedRecord(null);
								}}
								className={clsx(styles["btn-cancel"])}
								size="small"
							>
								Hủy
							</Button>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default Table;
