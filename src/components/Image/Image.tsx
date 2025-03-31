import { useState, forwardRef } from "react";
import styles from "./Image.module.scss";
import clsx from "clsx";

const DEFAULT_FALLBACK =
	"https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";

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
