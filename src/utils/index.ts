export const getYoutubeEmbedUrl = (url: string) => {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return match && match[2].length === 11
		? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
		: url;
};

export const numberFormat = (value: number) => {
	return value.toLocaleString("it-IT", {
		style: "currency",
		currency: "VND",
	});
};

export const getFirstLetter = (name: string | undefined) => {
	if (!name) return "";
	const nameArray = name.split(" ");
	return nameArray[nameArray.length - 1].charAt(0).toUpperCase();
};
