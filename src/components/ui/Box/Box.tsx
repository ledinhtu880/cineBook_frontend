import { ReactNode } from "react";
import { Box as Wrapper } from "@mui/material";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "90vw",
	maxWidth: "1000px",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 0,
	outline: "none",
	borderRadius: "8px",
	aspectRatio: "16/9",
};

const Box = ({ children }: { children: ReactNode }) => {
	return <Wrapper sx={style}>{children}</Wrapper>;
};

export default Box;
