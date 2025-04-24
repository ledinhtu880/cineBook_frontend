export const formateDateWithYear = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export const formatTime = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const formatDate = (date: Date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
	const formattedDate = `${day.toString().padStart(2, "0")}/${month
		.toString()
		.padStart(2, "0")}`;

	return { day, month, weekday, formattedDate };
};

export const isToday = (date: Date) => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};
