import clsx from "clsx";
import { Box, CircularProgress } from "@mui/material";

import styles from "./Loading.module.scss";

interface LoadingProps {
	className?: string;
	absolute?: boolean;
	full?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ className, absolute, full }) => {
	const classes = clsx(
		styles.loading,
		{
			[styles["abs-center"]]: absolute,
			[styles["full"]]: full,
		},
		className
	);

	return (
		<Box className={classes}>
			<CircularProgress size={50} />
		</Box>
	);
};

export default Loading;
