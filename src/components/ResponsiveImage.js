import React, { useState } from "react";

const ResponsiveImage = ({
	src,
	alt,
	width,
	height,
	className = "",
	loading = "lazy",
	fetchPriority = "auto",
	sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
	quality = 75,
	...props
}) => {
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	// Generate responsive srcSet for Cloudinary images
	const generateSrcSet = (imageSrc) => {
		if (!imageSrc || imageSrc.includes("banner-") || imageSrc.startsWith("/")) {
			return undefined; // Don't generate srcSet for local images or banners
		}

		// For Cloudinary images, generate responsive sizes
		const baseUrl = imageSrc.split("/upload/")[0];
		const path = imageSrc.split("/upload/")[1];

		const sizes = [
			{ width: 200, quality: quality },
			{ width: 400, quality: quality },
			{ width: 600, quality: quality },
			{ width: 800, quality: quality },
			{ width: 1000, quality: quality },
			{ width: 1200, quality: quality },
		];

		return sizes
			.map(
				({ width, quality }) =>
					`${baseUrl}/upload/w_${width},q_${quality},f_auto/${path} ${width}w`
			)
			.join(", ");
	};

	const handleError = () => {
		setImageError(true);
	};

	const handleLoad = () => {
		setImageLoaded(true);
	};

	const srcSet = generateSrcSet(src);

	return (
		<div className={`relative ${className}`}>
			{!imageLoaded && !imageError && (
				<div
					className="absolute inset-0 bg-gray-200 animate-pulse rounded"
					style={{
						aspectRatio: width && height ? `${width}/${height}` : "auto",
					}}
				/>
			)}
			<img
				src={src}
				alt={alt}
				width={width}
				height={height}
				className={`transition-opacity duration-300 ${
					imageLoaded ? "opacity-100" : "opacity-0"
				} ${className}`}
				loading={loading}
				fetchpriority={fetchPriority}
				sizes={sizes}
				srcSet={srcSet}
				onError={handleError}
				onLoad={handleLoad}
				{...props}
			/>
			{imageError && (
				<div
					className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400"
					style={{
						aspectRatio: width && height ? `${width}/${height}` : "auto",
					}}
				>
					<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			)}
		</div>
	);
};

export default ResponsiveImage;
