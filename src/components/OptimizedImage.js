import React, { useState, useRef, useEffect, useCallback } from "react";
import { createImageObserver, runWhenIdle } from "../utils/performanceUtils";

const OptimizedImage = ({
	src,
	alt,
	className = "",
	fallbackSrc = null,
	sizes = "(max-width: 480px) 128px, (max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px",
	loading = "lazy",
	onError = null,
	onLoad = null,
	...props
}) => {
	const [imageSrc, setImageSrc] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const imgRef = useRef(null);
	const observerRef = useRef(null);

	// Generate optimized Cloudinary URL
	const generateOptimizedSrc = useCallback((originalSrc, width) => {
		if (!originalSrc) return null;

		if (originalSrc.includes("res.cloudinary.com")) {
			try {
				const urlParts = originalSrc.split("/");
				const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
				const publicIdIndex = versionIndex + 1;

				if (versionIndex !== -1 && publicIdIndex < urlParts.length) {
					const version = urlParts[versionIndex];
					const publicId = urlParts.slice(publicIdIndex).join("/");

					// Highly optimized Cloudinary transformation
					return `https://res.cloudinary.com/${urlParts[3]}/image/upload/w_${width},q_auto:low,f_auto,c_fill,g_auto/${version}/${publicId}`;
				}
			} catch (error) {
				return originalSrc;
			}
		}

		return originalSrc;
	}, []);

	// Generate srcSet for responsive images
	const generateSrcSet = useCallback(
		(originalSrc) => {
			if (!originalSrc || !originalSrc.includes("res.cloudinary.com")) {
				return undefined;
			}

			const sizes = [128, 192, 256, 320, 384, 512, 640, 768];
			return sizes
				.map((size) => {
					try {
						const responsiveSrc = generateOptimizedSrc(originalSrc, size);
						return responsiveSrc ? `${responsiveSrc} ${size}w` : null;
					} catch (error) {
						return null;
					}
				})
				.filter(Boolean)
				.join(", ");
		},
		[generateOptimizedSrc]
	);

	// Handle image load
	const handleLoad = useCallback(() => {
		setIsLoading(false);
		if (onLoad) onLoad();
	}, [onLoad]);

	// Handle image error
	const handleError = useCallback(
		(e) => {
			setHasError(true);
			setIsLoading(false);

			if (fallbackSrc) {
				setImageSrc(fallbackSrc);
			} else if (onError) {
				onError(e);
			} else {
				if (e.target) {
					e.target.style.display = "none";
				}
			}
		},
		[fallbackSrc, onError]
	);

	// Set up intersection observer for lazy loading
	useEffect(() => {
		if (!imgRef.current || loading !== "lazy") {
			setIsVisible(true);
			return;
		}

		const observer = createImageObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observer.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: "50px" }
		);

		observer.observe(imgRef.current);
		observerRef.current = observer;

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [loading]);

	// Load image when visible
	useEffect(() => {
		if (!src || !isVisible) return;

		// Use requestIdleCallback to avoid blocking main thread
		const loadImage = () => {
			const responsiveSrc = generateOptimizedSrc(src, 192);
			setImageSrc(responsiveSrc);
		};

		runWhenIdle(loadImage);
	}, [src, isVisible, generateOptimizedSrc]);

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
		<div className={`relative ${className}`} ref={imgRef}>
			{isLoading && (
				<div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
					<div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
				</div>
			)}

			{isVisible && (
				<img
					src={imageSrc}
					srcSet={generateSrcSet(src)}
					sizes={sizes}
					alt={alt}
					className={`w-full h-full object-contain transition-opacity duration-200 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
					loading={loading}
					onError={handleError}
					onLoad={handleLoad}
					{...props}
				/>
			)}
		</div>
	);
};

export default OptimizedImage;
