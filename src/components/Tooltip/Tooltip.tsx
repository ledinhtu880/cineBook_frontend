import { TooltipProps } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";

const Tooltip = ({ children, ...props }: TooltipProps) => {
	return (
		<MuiTooltip
			{...props}
			sx={{ fontSize: "30" }}
			slotProps={{
				tooltip: {
					sx: {
						color: "#fff",
						backgroundColor: "#333",
					},
				},
				arrow: {
					sx: {
						color: "#333",
					},
				},
			}}
		>
			{children}
		</MuiTooltip>
	);
};

export default Tooltip;
