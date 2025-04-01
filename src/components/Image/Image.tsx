import { useState, forwardRef } from "react";
import clsx from "clsx";

import styles from "./Image.module.scss";
import images from "@/assets/images/";

const DEFAULT_FALLBACK = images.fallbackImage; // Default fallback image

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
	className?: string;
	fallbackSrc?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
	({ src, alt, className, fallbackSrc = DEFAULT_FALLBACK, ...props }, ref) => {
		const [fallback, setFallback] = useState("");

		const handleError = () => {
			setFallback(fallbackSrc);
		};

		return (
			<img
				className={clsx(styles.wrapper, className)}
				ref={ref}
				src={fallback || src}
				alt={alt}
				{...props}
				onError={handleError}
			/>
		);
	}
);
export default Image;
