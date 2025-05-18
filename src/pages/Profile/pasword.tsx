import type React from "react";

import { useState } from "react";
import { Card } from "@/components";

interface PasswordChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
}

export function PasswordChangeModal({
	isOpen,
	onClose,
	onSubmit,
}: PasswordChangeModalProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validate passwords
		if (!currentPassword) {
			setError("Vui lòng nhập mật khẩu hiện tại");
			return;
		}

		if (!newPassword) {
			setError("Vui lòng nhập mật khẩu mới");
			return;
		}

		if (newPassword.length < 6) {
			setError("Mật khẩu mới phải có ít nhất 6 ký tự");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Mật khẩu xác nhận không khớp");
			return;
		}

		setIsLoading(true);

		// Submit password change
		try {
			onSubmit({ currentPassword, newPassword });
			// Reset form
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			onClose();
		} catch (error) {
			console.log("Đã xảy ra lỗi khi đổi mật khẩu:", error);
			setError("Đã xảy ra lỗi khi đổi mật khẩu");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="w-full max-w-md">
				<Card title="Đổi mật khẩu">
					<form onSubmit={handleSubmit} className="p-6">
						{error && (
							<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
								{error}
							</div>
						)}

						<div className="mb-4">
							<label
								htmlFor="current-password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Mật khẩu hiện tại
							</label>
							<input
								id="current-password"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Nhập mật khẩu hiện tại"
							/>
						</div>

						<div className="mb-4">
							<label
								htmlFor="new-password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Mật khẩu mới
							</label>
							<input
								id="new-password"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Nhập mật khẩu mới"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Mật khẩu phải có ít nhất 6 ký tự
							</p>
						</div>

						<div className="mb-6">
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Xác nhận mật khẩu mới
							</label>
							<input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Nhập lại mật khẩu mới"
							/>
						</div>

						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
								disabled={isLoading}
							>
								Hủy
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
								disabled={isLoading}
							>
								{isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
							</button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}
