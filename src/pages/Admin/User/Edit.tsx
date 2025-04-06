import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import clsx from "clsx";

// import styles from "./User.module.scss";
import PageWrapper from "@/components/PageWrapper";
import Card from "@/components/Card";
import { userService } from "@/services";

interface UserInterface {
	id: number;
	name: string;
	email: string;
	role: boolean;
	string_role: string;
}

const UserSkeleton = () => {
	return (
		<div className="flex flex-col gap-6 p-4 pt-0 animate-pulse">
			<div className="flex items-center p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
				<div className="w-16 h-16 rounded-full bg-gray-200" />
				<div className="space-y-2">
					<div className="h-5 w-32 bg-gray-200 rounded" />
					<div className="h-4 w-24 bg-gray-200 rounded" />
				</div>
			</div>

			<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded" />
					<div className="h-10 w-full bg-gray-200 rounded" />
				</div>
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded" />
					<div className="h-10 w-full bg-gray-200 rounded" />
				</div>
			</div>
		</div>
	);
};

const Edit = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<UserInterface>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			if (!id) return;

			try {
				const response = await userService.getUserById(Number(id));
				setUser(response.data);
			} catch (error) {
				console.error(error);
				alert("Đã xảy ra lỗi. Vui lòng thử lại.");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [id]);

	const getAvatarUrl = (name: string) => {
		return `https://ui-avatars.com/api/?name=${encodeURIComponent(
			name
		)}&background=random&size=128`;
	};

	return (
		<PageWrapper title="Chỉnh sửa người dùng">
			<Card title="Thông tin người dùng">
				{loading ? (
					<UserSkeleton />
				) : (
					user && (
						<div className="flex flex-col gap-6 p-4 pt-0">
							<div className="flex items-center p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<img
									src={getAvatarUrl(user.name)}
									alt={user.name}
									className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
								/>
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										{user.name}
									</h3>
									<p className="text-gray-500 text-sm1">{user.string_role}</p>
								</div>
							</div>

							<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
								<div className="flex flex-col gap-2">
									<label htmlFor="name">Tên người dùng</label>
									<input
										type="text"
										id="name"
										value={user.name}
										onChange={(e) => setUser({ ...user, name: e.target.value })}
										className="border border-gray-300 rounded p-2"
									/>
								</div>
								<div className="flex flex-col gap-2">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										value={user.email}
										onChange={(e) =>
											setUser({ ...user, email: e.target.value })
										}
										className="border border-gray-300 rounded p-2"
									/>
								</div>
							</div>
						</div>
					)
				)}
			</Card>
		</PageWrapper>
	);
};

export default Edit;
