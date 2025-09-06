import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import {
	bannerImages,
	getResponsiveImageSrc,
	getResponsiveImageSrcSet,
} from "../../utils/imageConfig";

// Simple banner images with responsive sources
const simpleBanners = bannerImages.map((banner) => ({
	src: getResponsiveImageSrc(banner.name, "2xl"),
	fallback: getResponsiveImageSrc(banner.name, "2xl").replace(".webp", ".jpg"),
	alt: banner.alt,
	width: 1600,
	height: 900,
}));

// Custom styles for carousel controls
const carouselStyles = {
	carousel: {
		height: "100%",
	},
	carouselControl: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		backdropFilter: "blur(10px)",
		border: "1px solid rgba(255, 255, 255, 0.2)",
		borderRadius: "50%",
		width: "48px",
		height: "48px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 15,
		transition: "all 0.3s ease",
	},
	carouselControlPrev: {
		left: "20px",
		top: "50%",
		transform: "translateY(-50%)",
	},
	carouselControlNext: {
		right: "20px",
		top: "50%",
		transform: "translateY(-50%)",
	},
	carouselIndicator: {
		backgroundColor: "rgba(255, 255, 255, 0.4)",
		border: "1px solid rgba(255, 255, 255, 0.2)",
		width: "12px",
		height: "12px",
		borderRadius: "50%",
		margin: "0 4px",
		transition: "all 0.3s ease",
	},
	carouselIndicatorActive: {
		backgroundColor: "white",
		transform: "scale(1.2)",
		boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
	},
};

const Banner = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Preload images
		const preloadImages = async () => {
			const imagePromises = simpleBanners.map((banner) => {
				return new Promise((resolve) => {
					const img = new Image();
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = banner.src;
				});
			});

			await Promise.all(imagePromises);
			setIsLoading(false);
		};

		preloadImages();
	}, []);

	return (
		<div className="w-full max-w-7xl mx-auto text-center overflow-visible relative z-0">
			{isLoading ? (
				<div className="w-full mx-auto px-0">
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-b-xl animate-pulse aspect-[16/9]"></div>
				</div>
			) : simpleBanners.length > 0 ? (
				<Carousel
					interval={5000}
					pause={false}
					style={carouselStyles.carousel}
					controls={true}
					indicators={true}
				>
					{simpleBanners.map((banner, index) => (
						<Carousel.Item key={index}>
							<div className="w-full relative flex justify-center">
								<img
									src={banner.src}
									alt={banner.alt}
									width={banner.width}
									height={banner.height}
									className="w-full h-auto object-contain"
									loading={index === 0 ? "eager" : "lazy"}
									fetchpriority={index === 0 ? "high" : "auto"}
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 100vw"
									srcSet={getResponsiveImageSrcSet(banner.name)}
									onError={(e) => {
										console.warn(`Failed to load banner image: ${banner.src}`);
										e.target.style.display = "none";
									}}
								/>
								<div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-gray-300 z-5"></div>

								{/* Banner Text Overlay - Centered in first half of banner - Only on last banner */}
								{index === simpleBanners.length - 1 && (
									<div className="absolute inset-0 flex items-center justify-center z-10">
										<div className="text-center text-white transform -translate-y-1/3">
											<div className="bg-black bg-opacity-40 backdrop-blur-md rounded-3xl px-10 py-8 border border-white border-opacity-30 shadow-2xl max-w-2xl mx-4">
												<h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
													Carbon Cube
												</h1>
												<div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 mx-auto mb-6 rounded-full shadow-lg"></div>
												<p className="text-xl md:text-2xl font-semibold drop-shadow-lg text-gray-50 leading-relaxed">
													Premium Automotive Parts & Accessories
												</p>
												<div className="mt-6 flex justify-center space-x-3">
													<div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-md"></div>
													<div
														className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-md"
														style={{ animationDelay: "0.2s" }}
													></div>
													<div
														className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-md"
														style={{ animationDelay: "0.4s" }}
													></div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</Carousel.Item>
					))}
				</Carousel>
			) : (
				<div className="flex items-center justify-center h-64">
					<p className="text-gray-600">No banner images available</p>
				</div>
			)}
		</div>
	);
};

export default Banner;
