import { FormEvent } from "react";
import clsx from "clsx";

import styles from "./PasswordChangeModal.module.scss";
import { useState } from "react";
import { Modal, Button, Input } from "@/components";
import type { ValidationErrors } from "@/types";
import { validateChangePasswordForm } from "@/utils/authValidation";

interface PasswordChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => void;
	errors?: ValidationErrors; // Thay error thành errors
	clearErrors?: () => void; // Thay clearError thành clearErrors
	isSubmitting?: boolean;
}

export function PasswordChangeModal({
	isOpen,
	onClose,
	onSubmit,
	errors = {}, // Default empty object
	clearErrors,
}: PasswordChangeModalProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [localErrors, setLocalErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen) return null;

	const handleInputChange =
		(setter: (value: string) => void) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setter(e.target.value);
			if (clearErrors) clearErrors(); // Clear parent errors
			setLocalErrors({}); // Clear local validation errors
		};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setLocalErrors({});
		if (clearErrors) clearErrors(); // Clear parent errors

		// Frontend validation
		const validationErrors = validateChangePasswordForm(
			currentPassword,
			newPassword,
			confirmPassword
		);

		if (Object.keys(validationErrors).length > 0) {
			setLocalErrors(validationErrors);
			setIsLoading(false);
			return;
		}

		try {
			await onSubmit({ currentPassword, newPassword, confirmPassword });

			if (Object.keys(errors).length === 0) {
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (error) {
			console.error("Lỗi khi đổi mật khẩu:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const allErrors = { ...errors, ...localErrors };
	const hasErrors = Object.keys(allErrors).length > 0;

	return (
		<Modal title="Đổi mật khẩu" isOpen={isOpen} onClose={onClose} width={450}>
			<form onSubmit={handleSubmit}>
				{/* Hiển thị tất cả errors */}
				{hasErrors && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
						{Object.entries(allErrors).map(([key, error], index) => (
							<p className={clsx(styles["form-error"])} key={`${key}-${index}`}>
								{error}
							</p>
						))}
					</div>
				)}

				<Input
					id="current-password"
					type="password"
					label="Mật khẩu hiện tại"
					value={currentPassword}
					onChange={handleInputChange(setCurrentPassword)}
					placeholder="Nhập mật khẩu hiện tại"
					error={allErrors.currentPassword || allErrors.current_password}
				/>

				<Input
					id="new-password"
					type="password"
					label="Mật khẩu mới"
					value={newPassword}
					onChange={handleInputChange(setNewPassword)}
					placeholder="Nhập mật khẩu mới"
					error={allErrors.newPassword || allErrors.new_password}
				/>

				<Input
					id="confirm-password"
					type="password"
					label="Xác nhận mật khẩu"
					value={confirmPassword}
					onChange={handleInputChange(setConfirmPassword)}
					placeholder="Nhập lại mật khẩu mới"
					error={allErrors.confirmPassword || allErrors.password_confirmation}
				/>

				<div className={clsx(styles["btn-group"])}>
					<Button type="button" outline onClick={onClose} disabled={isLoading}>
						Hủy
					</Button>
					<Button type="submit" primary disabled={isLoading}>
						{isLoading ? "Đang xử lý..." : "Lưu"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
