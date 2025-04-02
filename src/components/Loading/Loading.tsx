import clsx from "clsx";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Loading.module.scss";

const Loading = () => (
	<Box className={clsx(styles.loading)}>
		<CircularProgress size={50} />
	</Box>
);

export default Loading;
