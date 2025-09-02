import React, { useEffect, useState } from "react";
import "./Banner.css";
import Carousel from "react-bootstrap/Carousel";

const Banner = () => {
	const [images, setImages] = useState([]);
	const [premiumAds, setPremiumAds] = useState([]);

	useEffect(() => {
		const fetchBannerImages = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/banners`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch banner images");
				}

				const banners = await response.json();
				const bannerImages = banners.map((banner) => banner.image_url);
				setImages(bannerImages);
			} catch (error) {
				console.error("Error fetching banner images:", error);
			}
		};

		const fetchPremiumAds = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/ads`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch ads");
				}

				const ads = await response.json();
				// Filter ads by tier priority: Premium (4) → Standard (3) → Basic (2) → Free (1)
				const premium = ads.filter((ad) => ad.seller_tier === 4);
				const standard = ads.filter((ad) => ad.seller_tier === 3);
				const basic = ads.filter((ad) => ad.seller_tier === 2);
				const free = ads.filter((ad) => ad.seller_tier === 1);

				// Build display ads array following tier hierarchy
				let displayAds = [...premium];
				if (displayAds.length < 3) {
					displayAds = [...displayAds, ...standard];
				}
				if (displayAds.length < 3) {
					displayAds = [...displayAds, ...basic];
				}
				if (displayAds.length < 3) {
					displayAds = [...displayAds, ...free];
				}

				// Shuffle and pick 3 random ads
				const shuffled = displayAds.sort(() => 0.5 - Math.random());

				setPremiumAds(shuffled.slice(0, 3));
			} catch (error) {
				console.error("Error fetching premium ads:", error);
			}
		};

		fetchBannerImages();
		fetchPremiumAds();
	}, []);

	return (
		<div className="banner">
			{images.length > 0 ? (
				<Carousel interval={5000} pause={false}>
					{images.map((src, index) => (
						<Carousel.Item key={index}>
							<div
								className="carousel-image"
								style={{
									backgroundImage: `url(${src})`,
								}}
							>
								{/* Add overlay for the last banner */}
								{index === images.length - 1 && premiumAds.length > 0 && (
									<div className="premium-ads-overlay">
										{premiumAds.map((ad) => {
											const adImage = ad.first_media_url
												? ad.first_media_url
												: ad.media_urls[0] || "default-image-url";

											{
												/* Debugging line */
											}

											return (
												<div
													key={ad.id}
													className="ad-image-container d-flex flex-column align-items-center"
												>
													<img
														src={adImage}
														alt={ad.title}
														className="premium-ad-image"
													/>
													<p className="text-white fw-bold flex-fill ">
														{ad.seller.enterprise_name}
													</p>
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
				<p>Loading images...</p>
			)}
		</div>
	);
};

export default Banner;
