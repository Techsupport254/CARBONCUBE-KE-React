import React, { useState, useRef, useEffect } from "react";

// Responsive image component with Cloudinary optimization
const ResponsiveImage = ({
	src,
	alt,
	className = "",
	fallbackSrc = null,
	sizes = "(max-width: 480px) 128px, (max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px",
	loading = "lazy",
	onError = null,
	...props
}) => {
	const [imageSrc, setImageSrc] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const imgRef = useRef(null);

	// Generate responsive image URLs with Cloudinary transformations
	const generateResponsiveSrc = (originalSrc, width) => {
		if (!originalSrc) return null;

		// Check if it's a Cloudinary URL
		if (originalSrc.includes("res.cloudinary.com")) {
			try {
				// Extract the public ID and version
				const urlParts = originalSrc.split("/");
				const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
				const publicIdIndex = versionIndex + 1;

				if (versionIndex !== -1 && publicIdIndex < urlParts.length) {
					const version = urlParts[versionIndex];
					// Keep the full public ID including the original file extension
					const publicId = urlParts.slice(publicIdIndex).join("/");

					// Generate highly optimized URL with aggressive compression
					// Use WebP/AVIF with quality auto, responsive width, and smart cropping
					return `https://res.cloudinary.com/${urlParts[3]}/image/upload/w_${width},q_auto:low,f_auto,c_fill,g_auto/${version}/${publicId}`;
				}
			} catch (error) {
				// Return original URL if transformation fails
				return originalSrc;
			}
		}

		return originalSrc;
	};

	useEffect(() => {
		if (!src) {
			setIsLoading(false);
			return;
		}

		// Generate responsive image URL
		const responsiveSrc = generateResponsiveSrc(src, 192); // Default mobile size
		setImageSrc(responsiveSrc);
		setIsLoading(false);
	}, [src]);

	const handleError = (e) => {
		setHasError(true);
		setIsLoading(false);

		if (fallbackSrc) {
			setImageSrc(fallbackSrc);
		} else if (onError) {
			onError(e);
		} else {
			// Default fallback behavior - hide the image
			if (e.target) {
				e.target.style.display = "none";
			}
		}
	};

	const handleLoad = () => {
		setIsLoading(false);
	};

	// Generate srcSet for different screen sizes with optimized breakpoints
	const generateSrcSet = (originalSrc) => {
		if (!originalSrc || !originalSrc.includes("res.cloudinary.com")) {
			return undefined;
		}

		// Optimized breakpoints for mobile-first responsive design
		const sizes = [128, 192, 256, 320, 384, 512, 640, 768];
		return sizes
			.map((size) => {
				try {
					const responsiveSrc = generateResponsiveSrc(originalSrc, size);
					return responsiveSrc ? `${responsiveSrc} ${size}w` : null;
				} catch (error) {
					return null;
				}
			})
			.filter(Boolean)
			.join(", ");
	};

	if (hasError && !fallbackSrc) {
		return (
			<div
				className={`bg-gray-100 flex items-center justify-center ${className}`}
			>
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-gray-400"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
					<circle cx="8.5" cy="8.5" r="1.5" />
					<polyline points="21,15 16,10 5,21" />
				</svg>
			</div>
		);
	}

	return (
		<div className={`relative ${className}`}>
			{isLoading && (
				<div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
					<div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
				</div>
			)}

			<img
				ref={imgRef}
				src={imageSrc}
				srcSet={generateSrcSet(src)}
				sizes={sizes}
				alt={alt}
				className={`w-full h-full object-contain transition-opacity duration-200 ${
					isLoading ? "opacity-0" : "opacity-100"
				} ${className}`}
				loading={loading}
				onError={handleError}
				onLoad={handleLoad}
				{...props}
			/>
		</div>
	);
};

export default ResponsiveImage;
