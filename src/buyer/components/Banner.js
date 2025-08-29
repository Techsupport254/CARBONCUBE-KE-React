import React, { useEffect, useState } from "react";
// import "./Banner.css"; // Removed CSS import
import Carousel from "react-bootstrap/Carousel";

// Import local banner images as fallback
import banner1 from "../../assets/banners/banner-01.jpg";
import banner2 from "../../assets/banners/banner-02.jpg";
import banner3 from "../../assets/banners/banner-03.jpg";
import banner4 from "../../assets/banners/banner-04.jpg";
import banner5 from "../../assets/banners/banner-05.jpg";

// Custom styles for carousel controls
const carouselStyles = {
	carousel: {
		height: "100%",
	},
	carouselControl: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		border: "none",
		borderRadius: "50%",
		width: "32px",
		height: "32px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 15,
	},
	carouselControlPrev: {
		left: "5px",
		top: "50%", // Center vertically
		transform: "translateY(-50%)",
	},
	carouselControlNext: {
		right: "5px",
		top: "50%", // Center vertically
		transform: "translateY(-50%)",
	},
	carouselIndicator: {
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		border: "none",
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		margin: "0 2px",
	},
	carouselIndicatorActive: {
		backgroundColor: "white",
	},
};

// Fallback banner images
const fallbackBanners = [banner1, banner2, banner3, banner4, banner5];

const Banner = () => {
	const [images, setImages] = useState([]);
	const [premiumAds, setPremiumAds] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Use fallback images and preload them before showing
		setImages(fallbackBanners);
		setIsLoading(true);

		const preload = (srcs) =>
			Promise.all(
				srcs.map(
					(src) =>
						new Promise((resolve) => {
							const img = new Image();
							img.onload = () => resolve();
							img.onerror = () => resolve();
							img.src = src;
						})
				)
			);

		preload(fallbackBanners).then(() => setIsLoading(false));

		const fetchPremiumAds = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/ads`);

				if (!response.ok) {
					throw new Error("Failed to fetch ads");
				}

				const ads = await response.json();
				// Filter for ads with `seller_tier` === 4
				const premium = ads.filter((ad) => ad.seller_tier === 4);

				// Shuffle and pick 3 random ads
				const shuffled = premium.sort(() => 0.5 - Math.random());

				setPremiumAds(shuffled.slice(0, 3));
			} catch (error) {
				console.error("Error fetching premium ads:", error);
			}
		};

		fetchPremiumAds();
	}, []);

	// Apply custom styles to carousel controls
	useEffect(() => {
		const applyCarouselStyles = () => {
			const carouselControls = document.querySelectorAll(
				".carousel-control-prev, .carousel-control-next"
			);
			const carouselIndicators = document.querySelectorAll(
				".carousel-indicators button"
			);

			// Get screen width for responsive sizing
			const screenWidth = window.innerWidth;

			// Responsive control sizes
			const controlSize = screenWidth < 768 ? 28 : screenWidth < 1024 ? 32 : 40;
			const controlPosition =
				screenWidth < 768 ? 3 : screenWidth < 1024 ? 5 : 10;
			const indicatorSize = screenWidth < 768 ? 6 : screenWidth < 1024 ? 8 : 12;
			const indicatorMargin =
				screenWidth < 768 ? 1 : screenWidth < 1024 ? 2 : 4;

			carouselControls.forEach((control, index) => {
				Object.assign(control.style, {
					...carouselStyles.carouselControl,
					width: `${controlSize}px`,
					height: `${controlSize}px`,
				});

				if (index === 0) {
					Object.assign(control.style, {
						...carouselStyles.carouselControlPrev,
						left: `${controlPosition}px`,
					});
				} else {
					Object.assign(control.style, {
						...carouselStyles.carouselControlNext,
						right: `${controlPosition}px`,
					});
				}
			});

			carouselIndicators.forEach((indicator, index) => {
				Object.assign(indicator.style, {
					...carouselStyles.carouselIndicator,
					width: `${indicatorSize}px`,
					height: `${indicatorSize}px`,
					margin: `0 ${indicatorMargin}px`,
				});
				if (indicator.classList.contains("active")) {
					Object.assign(
						indicator.style,
						carouselStyles.carouselIndicatorActive
					);
				}
			});
		};

		// Apply styles after a short delay to ensure carousel is rendered
		const timer = setTimeout(applyCarouselStyles, 100);

		// Add resize listener for responsive updates
		const handleResize = () => {
			applyCarouselStyles();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			clearTimeout(timer);
			window.removeEventListener("resize", handleResize);
		};
	}, [images.length]);

	return (
		<div className="w-full max-w-7xl mx-auto text-center overflow-visible relative z-1">
			{isLoading ? (
				<div className="w-full mx-auto px-0">
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-b-xl animate-pulse h-56 sm:h-72 md:h-96 lg:h-[28rem] xl:h-[34rem]"></div>
				</div>
			) : images.length > 0 ? (
				<Carousel
					interval={5000}
					pause={false}
					style={carouselStyles.carousel}
					controls={true}
					indicators={true}
				>
					{images.map((src, index) => (
						<Carousel.Item key={index}>
							<div className="w-full relative flex justify-center">
								<img
									src={src}
									alt={`Banner ${index + 1}`}
									className="w-full h-auto object-contain"
								/>
								<div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-gray-300 z-5"></div>
								{/* Add overlay for the last banner */}
								{index === images.length - 1 && premiumAds.length > 0 && (
									<div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 absolute z-10 w-full top-[10%] px-0">
										{premiumAds.map((ad, adIndex) => {
											const adImage = ad.first_media_url
												? ad.first_media_url
												: ad.media_urls[0] || "default-image-url";

											return (
												<div
													key={ad.id}
													className="group relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 lg:w-44 lg:h-52 xl:w-48 xl:h-56 rounded-3xl overflow-hidden shadow-2xl bg-white transform transition-all duration-500 hover:scale-110 hover:-translate-y-2"
													style={{
														animationDelay: `${adIndex * 0.2}s`,
													}}
												>
													{/* Gradient overlay */}
													<div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

													{/* Product image */}
													<div className="w-full h-3/4 p-2 sm:p-3 md:p-4">
														<img
															src={adImage}
															alt={ad.title}
															className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-110"
														/>
													</div>

													{/* Company name section */}
													<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 via-gray-800/80 to-transparent p-2 sm:p-3 md:p-4">
														<div className="text-center">
															<p className="text-white font-bold text-xs sm:text-sm md:text-base text-center drop-shadow-lg mb-1">
																{ad.seller.enterprise_name}
															</p>
															<div className="w-6 sm:w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
														</div>
													</div>

													{/* Shine effect */}
													<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
												</div>
											);
										})}
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
