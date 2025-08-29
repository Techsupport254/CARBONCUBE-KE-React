import React from "react";

const PopularAdsSection = ({
	ads = [],
	onAdClick,
	isLoading = false,
	errorMessage,
	onRetry,
}) => {
	// Get the first 8 ads from the flattened ads array
	const popularProducts = ads.slice(0, 8).map((ad, index) => ({
		id: ad.id,
		name: ad.title || `Product ${index + 1}`,
		image:
			ad.first_media_url ||
			ad.media_urls?.[0] ||
			"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center",
	}));

	// Loading skeletons (fixed layout)
	if (isLoading) {
		return (
			<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden">
				<div className="w-full bg-secondary text-white p-2 md:p-3 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-8 h-8 md:w-10 md:h-10 bg-white/25 rounded-full" />
						<div>
							<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
								Best Sellers
							</h3>
							<p className="text-xs sm:text-sm opacity-90 mb-0">
								Popular Products
							</p>
						</div>
					</div>
					<div className="hidden sm:block w-1/2" />
				</div>
				<div className="p-3 sm:p-4">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
								<div className="mt-2 h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (!isLoading && errorMessage) {
		return (
			<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden">
				<div className="w-full bg-secondary text-white p-2 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg" />
						<div>
							<h3 className="mb-0 font-bold text-xl sm:text-2xl">
								Best Sellers
							</h3>
							<p className="text-sm opacity-90 mb-0">Popular Products</p>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex items-center justify-between p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-200">
						<span className="text-sm">{errorMessage}</span>
						{onRetry && (
							<button
								onClick={onRetry}
								className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300"
							>
								Retry
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	// If no ads are available, show a message
	if (!isLoading && popularProducts.length === 0) {
		return (
			<div className="w-full">
				<div className="w-full bg-secondary text-white p-2 shadow-xl flex">
					<div className="w-1/2 flex items-center space-x-3">
						<div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
						<div>
							<h3 className="mb-0 font-bold text-xl sm:text-2xl">
								Best Sellers
							</h3>
							<p className="text-sm opacity-90 mb-0">Popular Products</p>
						</div>
					</div>
					<div className="hidden sm:block w-1/2">
						<div className="text-right">
							<div className="text-sm opacity-90">Featured</div>
							<div className="text-xs opacity-75">Premium Selection</div>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="text-center text-gray-500 py-8">
						<p>No popular products available at the moment.</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full border-2 border-gray-200 rounded-2xl overflow-hidden min-h-[30vh]">
			{/* Header */}
			<div className="w-full bg-secondary text-white p-2 md:p-3 shadow-xl flex">
				<div className="w-1/2 flex items-center space-x-3">
					<div className="w-8 h-8 md:w-10 md:h-10 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
						<svg
							className="w-5 h-5 md:w-6 md:h-6 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
					<div>
						<h3 className="mb-0 font-bold text-lg sm:text-xl md:text-2xl">
							Best Sellers
						</h3>
						<p className="text-xs sm:text-sm opacity-90 mb-0">
							Popular Products
						</p>
					</div>
				</div>
				<div className="hidden sm:block w-1/2">
					<div className="text-right">
						<div className="text-xs sm:text-sm opacity-90">Featured</div>
						<div className="text-[10px] sm:text-xs opacity-75">
							Premium Selection
						</div>
					</div>
				</div>
			</div>
			{/* Body */}
			<div className="p-3 sm:p-4">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
					{popularProducts.map((product) => (
						<div
							key={product.id}
							className="flex flex-col items-center text-center hover:shadow-lg transition-all duration-200 cursor-pointer group"
							onClick={() => onAdClick && onAdClick(product.id)}
						>
							<div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
								<img
									src={
										product.image
											? product.image.replace(/\n/g, "").trim()
											: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center"
									}
									alt={product.name}
									className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
									loading="lazy"
									onLoad={(e) => {
										e.target.style.opacity = "1";
									}}
									onError={(e) => {
										// Use a data URI as fallback to prevent infinite loops
										e.target.src =
											"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTgwIDEwNUwxNTAgMTM1TDEyMCAxMDVMMTUwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
										e.target.style.opacity = "1";
									}}
								/>
							</div>
							<div className="mt-2 text-xs sm:text-sm line-clamp-2">
								{product.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PopularAdsSection;
