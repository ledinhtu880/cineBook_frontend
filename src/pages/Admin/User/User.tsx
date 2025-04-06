import { useState, useEffect } from "react";

import PageWrapper from "@/components/PageWrapper";
import Loading from "@/components/Loading";
import Table from "@/components/Table";
import Card from "@/components/Card";
import { userService } from "@/services/";
import { useDebounce } from "@/hooks";
import { ApiError } from "@/types/";
import { Column } from "@/types/";

interface UserData {
	id: number;
	name: string;
	email: string;
	string_role: string;
}

const columns: Column<UserData>[] = [
	{ key: "id", title: "#" },
	{ key: "name", title: "Tên người dùng" },
	{ key: "email", title: "Email" },
	{ key: "string_role", title: "Vai trò" },
];
const User = () => {
	const [users, setUsers] = useState<UserData[]>([]);
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
				if (apiError.response?.data?.errors) {
					console.log(apiError.response?.data?.errors);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<PageWrapper title="Quản lý người dùng">
			<Card title="Danh sách người dùng" action onSearch={setSearchKeyword}>
				{loading ? (
					<Loading />
				) : (
					<Table<UserData>
						columns={columns}
						data={filteredUsers}
						editPath="/admin/users"
					/>
				)}
			</Card>
		</PageWrapper>
	);
};

export default User;
