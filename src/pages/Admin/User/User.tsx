import { useState, useEffect } from "react";

import { Column, ApiError, UserProps } from "@/types/";
import { useDebounce } from "@/hooks";
import { userService } from "@/services/";
import { useSnackbar } from "@/context";
import { PageWrapper, Loading, Table, Card } from "@/components";

const columns: Column<UserProps>[] = [
	{ key: "id", title: "#" },
	{ key: "name", title: "Tên người dùng" },
	{ key: "email", title: "Email" },
	{ key: "string_role", title: "Vai trò" },
];
const User = () => {
	const { showSnackbar } = useSnackbar();
	const [users, setUsers] = useState<UserProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState("");
	const debouncedValue = useDebounce(searchKeyword, 250);

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
			user.email.toLowerCase().includes(debouncedValue.toLowerCase())
	);

	useEffect(() => {
		(async () => {
			try {
				const response = await userService.getUsers();
				setUsers(response);
			} catch (error) {
				const apiError = error as ApiError;
				if (apiError.response?.data) {
					showSnackbar(apiError.response.data.message, "error");
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [showSnackbar]);

	return (
		<PageWrapper title="Quản lý người dùng">
			<Card title="Danh sách người dùng" onSearch={setSearchKeyword}>
				{loading ? (
					<Loading />
				) : (
					<Table<UserProps>
						columns={columns}
						data={filteredUsers}
						showPath="/admin/users"
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default User;
