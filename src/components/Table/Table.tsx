import { useState } from "react";
import {
	Visibility,
	Edit,
	Delete,
	Warning,
	KeyboardArrowLeft,
	KeyboardArrowRight,
} from "@mui/icons-material";
import clsx from "clsx";

import styles from "./Table.module.scss";
import { Column } from "@/types/";
import { Tooltip, Button, Modal } from "@/components";

interface TableProps<T extends { id: number; name?: string; title?: string }> {
	columns: Column<T>[];
	data: T[];
	editPath?: string;
	showPath?: string;
	onDelete?: (record: T) => void;
	pageSize?: number;
}

const Table = <T extends { id: number; name?: string; title?: string }>({
	columns,
	data,
	editPath,
	showPath,
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
						{(editPath || showPath || onDelete) && (
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
										style={{
											width: column.width,
											maxWidth: column.width,
										}}
									>
										{column.tooltip ? (
											<Tooltip
												title={String(record[column.key])}
												placement="bottom-start"
											>
												<div className="truncate">
													{column.render
														? column.render(record[column.key], record)
														: String(record[column.key])}
												</div>
											</Tooltip>
										) : (
											<>
												{column.render
													? column.render(record[column.key], record)
													: String(record[column.key])}
											</>
										)}
									</td>
								))}
								{(editPath || showPath || onDelete) && (
									<td className={clsx(styles["actions-wrapper"])}>
										{showPath && (
											<Tooltip title="Xem chi tiết" placement="bottom" arrow>
												<Button
													to={`${showPath}/${record.id}`}
													size="no-padding"
													className={clsx(styles["actions-btn-show"])}
												>
													<Visibility fontSize="small" />
												</Button>
											</Tooltip>
										)}
										{editPath && (
											<Tooltip title="Sửa dữ liệu" placement="bottom" arrow>
												<Button
													to={`${editPath}/${record.id}/edit`}
													size="no-padding"
													className={clsx(styles["actions-btn-edit"])}
												>
													<Edit fontSize="small" />
												</Button>
											</Tooltip>
										)}
										{onDelete && (
											<Tooltip title="Xóa dữ liệu" placement="bottom" arrow>
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
											</Tooltip>
										)}
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* Pagination Controls */}
			{data.length > Number(pageSize) && (
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
			)}

			{onDelete && (
				<Modal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSelectedRecord(null);
					}}
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
								>
									Xóa
								</Button>
								<Button
									onClick={() => {
										setIsModalOpen(false);
										setSelectedRecord(null);
									}}
									className={clsx(styles["btn-cancel"])}
								>
									Hủy
								</Button>
							</div>
						</>
					)}
				</Modal>
			)}
		</div>
	);
};

export default Table;
