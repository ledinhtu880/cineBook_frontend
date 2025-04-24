export const formatDate = (date: Date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
	const formattedDate = `${day.toString().padStart(2, "0")}/${month
		.toString()
		.padStart(2, "0")}`;

	const formattedDateWithYear = `${day.toString().padStart(2, "0")}/${month
		.toString()
		.padStart(2, "0")}/${year}`;

	return { day, month, weekday, formattedDate, formattedDateWithYear };
};

export const isToday = (date: Date) => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};
