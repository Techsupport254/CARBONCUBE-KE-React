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
		if (
			!imageSrc ||
			imageSrc.includes("banner-") ||
			imageSrc.startsWith("/") ||
			imageSrc.startsWith("data:")
		) {
			return undefined; // Don't generate srcSet for local images, banners, or data URIs
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
					className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center"
					style={{
						aspectRatio: width && height ? `${width}/${height}` : "auto",
					}}
				>
					<div className="text-gray-400">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mb-2"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21,15 16,10 5,21" />
						</svg>
					</div>
					<div className="text-xs text-gray-500 font-medium text-center px-2">
						No Image
					</div>
				</div>
			)}
		</div>
	);
};

export default ResponsiveImage;
