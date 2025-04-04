import { useParams } from "react-router-dom";
import clsx from "clsx";

import styles from "./User.module.scss";
import PageWrapper from "@/components/PageWrapper";
import Card from "@/components/Card";

const Edit = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<PageWrapper title="Chỉnh sửa người dùng">
			<Card title="Thông tin người dùng">Hello</Card>
		</PageWrapper>
	);
};

export default Edit;
