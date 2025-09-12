const fs = require('fs');
const path = require('path');

// Route configurations with SEO data
const routes = [
	{
		path: 'index.html',
		title: 'Carbon Cube Kenya | Kenya\'s Most Trusted Online Marketplace',
		description: 'Carbon Cube Kenya is Kenya\'s most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.',
		keywords: 'Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya',
		ogTitle: 'Carbon Cube Kenya | Kenya\'s Most Trusted Online Marketplace',
		ogDescription: 'Carbon Cube Kenya is Kenya\'s most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/',
		priority: '1.0'
	},
	{
		path: 'home.html',
		title: 'Home | Carbon Cube Kenya',
		description: 'Welcome to Carbon Cube Kenya\'s home page. Discover trusted sellers, secure transactions, and AI-powered marketplace features.',
		keywords: 'Carbon Cube Kenya home, marketplace home, online shopping Kenya, buyer dashboard, Kenya marketplace',
		ogTitle: 'Home | Carbon Cube Kenya',
		ogDescription: 'Welcome to Carbon Cube Kenya\'s home page. Discover trusted sellers, secure transactions, and AI-powered marketplace features.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/home',
		priority: '0.9'
	},
	{
		path: 'categories.html',
		title: 'Categories | Carbon Cube Kenya',
		description: 'Browse all product categories on Carbon Cube Kenya. Find everything you need from verified sellers across Kenya.',
		keywords: 'Carbon Cube Kenya categories, marketplace categories, product categories, online shopping categories, Kenya ecommerce categories',
		ogTitle: 'Categories | Carbon Cube Kenya',
		ogDescription: 'Browse all product categories on Carbon Cube Kenya. Find everything you need from verified sellers across Kenya.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/categories',
		priority: '0.8'
	},
	{
		path: 'about-us.html',
		title: 'About Us | Carbon Cube Kenya',
		description: 'Learn about Carbon Cube Kenya\'s mission to create Kenya\'s most trusted online marketplace with AI-powered tools and verified sellers.',
		keywords: 'about Carbon Cube Kenya, company information, Kenya marketplace, trusted online platform, AI-powered marketplace',
		ogTitle: 'About Us | Carbon Cube Kenya',
		ogDescription: 'Learn about Carbon Cube Kenya\'s mission to create Kenya\'s most trusted online marketplace with AI-powered tools and verified sellers.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/about-us',
		priority: '0.7'
	},
	{
		path: 'contact-us.html',
		title: 'Contact Us | Carbon Cube Kenya',
		description: 'Get in touch with Carbon Cube Kenya. Contact our customer support team for assistance with your marketplace needs.',
		keywords: 'contact Carbon Cube Kenya, customer support, help center, Kenya marketplace support',
		ogTitle: 'Contact Us | Carbon Cube Kenya',
		ogDescription: 'Get in touch with Carbon Cube Kenya. Contact our customer support team for assistance with your marketplace needs.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/contact-us',
		priority: '0.7'
	},
	{
		path: 'login.html',
		title: 'Login | Carbon Cube Kenya',
		description: 'Login to your Carbon Cube Kenya account. Access your dashboard, manage listings, and connect with trusted buyers and sellers.',
		keywords: 'login Carbon Cube Kenya, account access, marketplace login, Kenya marketplace account',
		ogTitle: 'Login | Carbon Cube Kenya',
		ogDescription: 'Login to your Carbon Cube Kenya account. Access your dashboard, manage listings, and connect with trusted buyers and sellers.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/login',
		priority: '0.6'
	},
	{
		path: 'buyer-signup.html',
		title: 'Buyer Signup | Carbon Cube Kenya',
		description: 'Join Carbon Cube Kenya as a buyer. Create your account and start shopping from verified sellers with secure transactions.',
		keywords: 'buyer signup Carbon Cube Kenya, create buyer account, Kenya marketplace buyer registration',
		ogTitle: 'Buyer Signup | Carbon Cube Kenya',
		ogDescription: 'Join Carbon Cube Kenya as a buyer. Create your account and start shopping from verified sellers with secure transactions.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/buyer-signup',
		priority: '0.7'
	},
	{
		path: 'seller-signup.html',
		title: 'Seller Signup | Carbon Cube Kenya',
		description: 'Join Carbon Cube Kenya as a seller. Create your seller account and start selling to verified buyers with AI-powered tools.',
		keywords: 'seller signup Carbon Cube Kenya, create seller account, Kenya marketplace seller registration',
		ogTitle: 'Seller Signup | Carbon Cube Kenya',
		ogDescription: 'Join Carbon Cube Kenya as a seller. Create your seller account and start selling to verified buyers with AI-powered tools.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/seller-signup',
		priority: '0.7'
	},
	{
		path: 'forgot-password.html',
		title: 'Forgot Password | Carbon Cube Kenya',
		description: 'Reset your Carbon Cube Kenya password. Recover access to your marketplace account with our secure password reset process.',
		keywords: 'forgot password Carbon Cube Kenya, password reset, account recovery, Kenya marketplace password',
		ogTitle: 'Forgot Password | Carbon Cube Kenya',
		ogDescription: 'Reset your Carbon Cube Kenya password. Recover access to your marketplace account with our secure password reset process.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/forgot-password',
		priority: '0.5'
	},
	{
		path: 'terms-and-conditions.html',
		title: 'Terms and Conditions | Carbon Cube Kenya',
		description: 'Read Carbon Cube Kenya\'s terms and conditions. Understand our marketplace policies, user agreements, and service terms.',
		keywords: 'terms and conditions Carbon Cube Kenya, user agreement, marketplace terms, Kenya marketplace policies',
		ogTitle: 'Terms and Conditions | Carbon Cube Kenya',
		ogDescription: 'Read Carbon Cube Kenya\'s terms and conditions. Understand our marketplace policies, user agreements, and service terms.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/terms-and-conditions',
		priority: '0.5'
	},
	{
		path: 'privacy.html',
		title: 'Privacy Policy | Carbon Cube Kenya',
		description: 'Learn about Carbon Cube Kenya\'s privacy policy. Understand how we protect your data and ensure secure transactions.',
		keywords: 'privacy policy Carbon Cube Kenya, data protection, privacy policy Kenya marketplace, secure transactions',
		ogTitle: 'Privacy Policy | Carbon Cube Kenya',
		ogDescription: 'Learn about Carbon Cube Kenya\'s privacy policy. Understand how we protect your data and ensure secure transactions.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/privacy',
		priority: '0.5'
	},
	{
		path: 'privacy-policy.html',
		title: 'Privacy Policy | Carbon Cube Kenya',
		description: 'Learn about Carbon Cube Kenya\'s privacy policy. Understand how we protect your data and ensure secure transactions.',
		keywords: 'privacy policy Carbon Cube Kenya, data protection, privacy policy Kenya marketplace, secure transactions',
		ogTitle: 'Privacy Policy | Carbon Cube Kenya',
		ogDescription: 'Learn about Carbon Cube Kenya\'s privacy policy. Understand how we protect your data and ensure secure transactions.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/privacy-policy',
		priority: '0.5'
	},
	{
		path: 'faqs.html',
		title: 'FAQs | Carbon Cube Kenya',
		description: 'Find answers to frequently asked questions about Carbon Cube Kenya. Get help with marketplace features, transactions, and account management.',
		keywords: 'FAQs Carbon Cube Kenya, frequently asked questions, marketplace help, Kenya marketplace support',
		ogTitle: 'FAQs | Carbon Cube Kenya',
		ogDescription: 'Find answers to frequently asked questions about Carbon Cube Kenya. Get help with marketplace features, transactions, and account management.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/faqs',
		priority: '0.6'
	},
	{
		path: 'how-to-pay.html',
		title: 'How to Pay | Carbon Cube Kenya',
		description: 'Learn how to make secure payments on Carbon Cube Kenya. Discover our payment methods and secure transaction process.',
		keywords: 'how to pay Carbon Cube Kenya, payment methods, secure payments, Kenya marketplace payments',
		ogTitle: 'How to Pay | Carbon Cube Kenya',
		ogDescription: 'Learn how to make secure payments on Carbon Cube Kenya. Discover our payment methods and secure transaction process.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/how-to-pay',
		priority: '0.6'
	},
	{
		path: 'how-to-shop.html',
		title: 'How to Shop | Carbon Cube Kenya',
		description: 'Learn how to shop on Carbon Cube Kenya. Discover our marketplace features, find trusted sellers, and make secure purchases.',
		keywords: 'how to shop Carbon Cube Kenya, shopping guide, marketplace tutorial, Kenya marketplace shopping',
		ogTitle: 'How to Shop | Carbon Cube Kenya',
		ogDescription: 'Learn how to shop on Carbon Cube Kenya. Discover our marketplace features, find trusted sellers, and make secure purchases.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/how-to-shop',
		priority: '0.6'
	},
	{
		path: 'become-a-seller.html',
		title: 'Become a Seller | Carbon Cube Kenya',
		description: 'Join Carbon Cube Kenya as a seller. Learn about our seller benefits, verification process, and start selling to verified buyers.',
		keywords: 'become a seller Carbon Cube Kenya, seller benefits, seller verification, Kenya marketplace selling',
		ogTitle: 'Become a Seller | Carbon Cube Kenya',
		ogDescription: 'Join Carbon Cube Kenya as a seller. Learn about our seller benefits, verification process, and start selling to verified buyers.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/become-a-seller',
		priority: '0.7'
	},
	{
		path: 'vendor-help.html',
		title: 'Vendor Help | Carbon Cube Kenya',
		description: 'Get help as a vendor on Carbon Cube Kenya. Access vendor resources, support guides, and seller assistance.',
		keywords: 'vendor help Carbon Cube Kenya, seller support, vendor resources, Kenya marketplace vendor help',
		ogTitle: 'Vendor Help | Carbon Cube Kenya',
		ogDescription: 'Get help as a vendor on Carbon Cube Kenya. Access vendor resources, support guides, and seller assistance.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/vendor-help',
		priority: '0.6'
	},
	{
		path: 'seller-help.html',
		title: 'Seller Help | Carbon Cube Kenya',
		description: 'Get help as a seller on Carbon Cube Kenya. Access seller resources, support guides, and seller assistance.',
		keywords: 'seller help Carbon Cube Kenya, seller support, seller resources, Kenya marketplace seller help',
		ogTitle: 'Seller Help | Carbon Cube Kenya',
		ogDescription: 'Get help as a seller on Carbon Cube Kenya. Access seller resources, support guides, and seller assistance.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/seller-help',
		priority: '0.6'
	},
	{
		path: 'seller/tiers.html',
		title: 'Seller Tiers | Carbon Cube Kenya',
		description: 'Explore Carbon Cube Kenya\'s seller tier system. Learn about different seller levels, benefits, and upgrade options.',
		keywords: 'seller tiers Carbon Cube Kenya, seller subscription plans, tier pricing, seller upgrade options, Kenya marketplace seller tiers',
		ogTitle: 'Seller Tiers | Carbon Cube Kenya',
		ogDescription: 'Explore Carbon Cube Kenya\'s seller tier system. Learn about different seller levels, benefits, and upgrade options.',
		ogImage: 'https://carboncube-ke.com/logo.png',
		canonical: 'https://carboncube-ke.com/seller/tiers',
		priority: '0.7'
	}
];

// Read the base index.html template
const templatePath = path.join(__dirname, '..', 'public', 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Function to generate HTML for a specific route
function generateRouteHTML(route) {
	let html = template;
	
	// Replace meta tags
	html = html.replace(
		/<meta name="title" content="[^"]*" \/>/,
		`<meta name="title" content="${route.title}" />`
	);
	
	html = html.replace(
		/<meta name="description" content="[^"]*" \/>/,
		`<meta name="description" content="${route.description}" />`
	);
	
	html = html.replace(
		/<meta name="keywords" content="[^"]*" \/>/,
		`<meta name="keywords" content="${route.keywords}" />`
	);
	
	// Replace Open Graph tags
	html = html.replace(
		/<meta property="og:title" content="[^"]*" \/>/,
		`<meta property="og:title" content="${route.ogTitle}" />`
	);
	
	html = html.replace(
		/<meta property="og:description" content="[^"]*" \/>/,
		`<meta property="og:description" content="${route.ogDescription}" />`
	);
	
	html = html.replace(
		/<meta property="og:url" content="[^"]*" \/>/,
		`<meta property="og:url" content="${route.canonical}" />`
	);
	
	// Replace Twitter Card tags
	html = html.replace(
		/<meta name="twitter:title" content="[^"]*" \/>/,
		`<meta name="twitter:title" content="${route.ogTitle}" />`
	);
	
	html = html.replace(
		/<meta name="twitter:description" content="[^"]*" \/>/,
		`<meta name="twitter:description" content="${route.ogDescription}" />`
	);
	
	// Replace canonical URL
	html = html.replace(
		/<link rel="canonical" href="[^"]*" \/>/,
		`<link rel="canonical" href="${route.canonical}" />`
	);
	
	// Replace page title
	html = html.replace(
		/<title>[^<]*<\/title>/,
		`<title>${route.title}</title>`
	);
	
	return html;
}

// Generate HTML files for each route
const buildDir = path.join(__dirname, '..', 'build');

console.log('🚀 Generating static HTML files for each route...');

routes.forEach(route => {
	const html = generateRouteHTML(route);
	const filePath = path.join(buildDir, route.path);
	
	// Create directory if it doesn't exist (for nested routes like seller/tiers.html)
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	
	fs.writeFileSync(filePath, html);
	console.log(`✅ Generated: ${route.path}`);
});

console.log('🎉 Static HTML generation completed!');
console.log(`📊 Generated ${routes.length} route-specific HTML files`);
console.log('🔗 Each file now has unique meta tags for social media sharing');
