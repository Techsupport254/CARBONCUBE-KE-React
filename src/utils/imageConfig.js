// Auto-generated responsive image configuration
export const bannerImages = [
	{
		name: "banner-01",
		alt: "Banner 1",
		sizes: {
			sm: "/optimized-banners/banner-01-sm.webp",
			md: "/optimized-banners/banner-01-md.webp",
			lg: "/optimized-banners/banner-01-lg.webp",
			xl: "/optimized-banners/banner-01-xl.webp",
			"2xl": "/optimized-banners/banner-01-2xl.webp",
		},
	},
	{
		name: "banner-02",
		alt: "Banner 2",
		sizes: {
			sm: "/optimized-banners/banner-02-sm.webp",
			md: "/optimized-banners/banner-02-md.webp",
			lg: "/optimized-banners/banner-02-lg.webp",
			xl: "/optimized-banners/banner-02-xl.webp",
			"2xl": "/optimized-banners/banner-02-2xl.webp",
		},
	},
	{
		name: "banner-03",
		alt: "Banner 3",
		sizes: {
			sm: "/optimized-banners/banner-03-sm.webp",
			md: "/optimized-banners/banner-03-md.webp",
			lg: "/optimized-banners/banner-03-lg.webp",
			xl: "/optimized-banners/banner-03-xl.webp",
			"2xl": "/optimized-banners/banner-03-2xl.webp",
		},
	},
	{
		name: "banner-04",
		alt: "Banner 4",
		sizes: {
			sm: "/optimized-banners/banner-04-sm.webp",
			md: "/optimized-banners/banner-04-md.webp",
			lg: "/optimized-banners/banner-04-lg.webp",
			xl: "/optimized-banners/banner-04-xl.webp",
			"2xl": "/optimized-banners/banner-04-2xl.webp",
		},
	},
	{
		name: "banner-05",
		alt: "Banner 5",
		sizes: {
			sm: "/optimized-banners/banner-05-sm.webp",
			md: "/optimized-banners/banner-05-md.webp",
			lg: "/optimized-banners/banner-05-lg.webp",
			xl: "/optimized-banners/banner-05-xl.webp",
			"2xl": "/optimized-banners/banner-05-2xl.webp",
		},
	},
];

export const getResponsiveImageSrc = (imageName, size = "xl") => {
	const image = bannerImages.find((img) => img.name === imageName);
	return image ? image.sizes[size] : null;
};

export const getResponsiveImageSrcSet = (imageName) => {
	const image = bannerImages.find((img) => img.name === imageName);
	if (!image) return "";

	return Object.entries(image.sizes)
		.map(([size, src]) => {
			const width =
				size === "sm"
					? 640
					: size === "md"
					? 768
					: size === "lg"
					? 1024
					: size === "xl"
					? 1280
					: 1536;
			return `${src} ${width}w`;
		})
		.join(", ");
};
