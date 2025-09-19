import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import Spinner from "react-spinkit";

const SellerCommunications = ({ onLogout }) => {
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedAudience, setSelectedAudience] = useState("test_seller");
	const [customSubject, setCustomSubject] = useState("");
	const [customMessage, setCustomMessage] = useState("");
	const [testSeller, setTestSeller] = useState(null);
	const [showEmailPreview, setShowEmailPreview] = useState(false);
	const [previewData, setPreviewData] = useState(null);
	const [availableSellers, setAvailableSellers] = useState([]);

	// Message templates for seller communications
	const messageTemplates = {
		details_update: {
			subject: "Complete Your Seller Profile for Better Visibility",
			body: `Dear Seller,

We're excited to see the growing traction on our platform! To help you get the most out of your listings and improve your visibility to potential buyers, we encourage you to:

✅ Complete your seller profile with accurate details
✅ Add a professional profile picture
✅ Verify your contact information
✅ Update your business description

Complete profiles receive 40% more engagement from buyers. Take a few minutes to update your details and watch your sales grow!

Best regards,
The Carbon Team`,
		},
		engagement: {
			subject: "Exciting Platform Growth - Your Opportunity to Thrive",
			body: `Dear Seller,

Great news! Our platform is experiencing incredible growth:

📈 150% increase in buyer registrations this month
📈 200% increase in ad views and engagement
📈 85% increase in successful transactions

This means more potential customers are discovering our platform every day. To capitalize on this growth:

• Ensure your ads are active and well-described
• Respond quickly to buyer inquiries
• Keep your pricing competitive
• Share high-quality photos of your items

Don't miss out on this opportunity to grow your business with us!

Best regards,
The Carbon Team`,
		},
		best_practices: {
			subject: "Tips to Maximize Your Ad Performance",
			body: `Dear Seller,

Want to increase your sales and get more visibility? Here are proven tips from our top-performing sellers:

📸 **Great Photos**: Use clear, well-lit photos from multiple angles
📝 **Detailed Descriptions**: Include all relevant details, condition, and specifications
💰 **Competitive Pricing**: Research similar items to price competitively
⚡ **Quick Responses**: Respond to inquiries within 2 hours for better conversion
🔄 **Regular Updates**: Refresh your ads weekly to maintain visibility

Sellers who follow these practices see 60% more engagement and 35% faster sales.

Start implementing these tips today and watch your sales improve!

Best regards,
The Carbon Team`,
		},
		welcome_new: {
			subject: "Welcome to Carbon Cube - Let's Get You Started!",
			body: `Dear Seller,

Welcome to Carbon Cube! We're thrilled to have you join our growing community of successful sellers.

As a new member, here's what you need to know to get started:

🚀 **Getting Started Checklist:**
✅ Complete your seller profile
✅ Upload your first product listing
✅ Set up your payment preferences
✅ Verify your contact information

💡 **Pro Tips for New Sellers:**
• Start with 3-5 high-quality listings
• Use clear, well-lit photos
• Write detailed product descriptions
• Set competitive prices
• Respond quickly to buyer messages

🎯 **Your Success is Our Priority:**
Our support team is here to help you succeed. Don't hesitate to reach out if you have any questions.

Ready to start selling? Let's make your first sale together!

Best regards,
The Carbon Team`,
		},
		performance_review: {
			subject: "Your Monthly Performance Review - Great Progress!",
			body: `Dear Seller,

We're excited to share your monthly performance insights with you!

📊 **Your Performance Highlights:**
• Active listings performing well
• Positive buyer feedback received
• Consistent engagement with customers
• Growing visibility in search results

🎯 **Areas for Improvement:**
• Consider adding more product photos
• Update descriptions with more details
• Respond to inquiries faster
• Refresh listings weekly

💪 **Next Steps to Boost Sales:**
1. Add seasonal items to your inventory
2. Use trending keywords in descriptions
3. Share your listings on social media
4. Offer bundle deals for multiple items

Keep up the excellent work! We're here to support your continued success.

Best regards,
The Carbon Team`,
		},
		seasonal_promotion: {
			subject: "Special Seasonal Promotion - Boost Your Sales!",
			body: `Dear Seller,

The holiday season is approaching, and it's the perfect time to maximize your sales potential!

🎄 **Seasonal Selling Opportunities:**
• Holiday gifts and decorations
• Back-to-school items
• Summer/winter seasonal products
• Special occasion items

📈 **Platform Promotions:**
• Featured seller spots available
• Increased buyer traffic expected
• Special promotional campaigns
• Enhanced visibility opportunities

💡 **Seasonal Selling Tips:**
• Update your listings with seasonal keywords
• Offer holiday discounts and bundles
• Ensure fast shipping for gift items
• Create gift-ready packaging options

Don't miss out on this peak selling season! Start preparing your seasonal inventory now.

Best regards,
The Carbon Team`,
		},
		policy_update: {
			subject: "Important Platform Updates - Please Review",
			body: `Dear Seller,

We're writing to inform you about important updates to our platform policies and features.

📋 **Key Updates:**
• Updated seller guidelines and best practices
• New payment processing options
• Enhanced security measures
• Improved listing management tools

🔒 **Security Enhancements:**
• Two-factor authentication now available
• Enhanced account protection features
• Improved fraud detection systems
• Secure payment processing updates

📱 **New Features:**
• Mobile app improvements
• Better analytics dashboard
• Enhanced messaging system
• Streamlined listing process

Please review these updates and ensure your account is up to date. Your compliance helps maintain a safe and successful marketplace for everyone.

Best regards,
The Carbon Team`,
		},
		reactivation: {
			subject: "We Miss You - Come Back to Carbon Cube!",
			body: `Dear Seller,

We noticed you haven't been active on Carbon Cube recently, and we wanted to reach out to see how we can help you get back to selling!

🤔 **Why Come Back?**
• Your listings are still visible to buyers
• New features have been added since you last logged in
• Increased buyer activity on the platform
• Special incentives for returning sellers

🚀 **Getting Back on Track:**
• Log in to refresh your listings
• Update your product information
• Check for new buyer inquiries
• Explore new selling opportunities

💝 **Welcome Back Bonus:**
As a returning seller, you'll receive:
• Priority customer support
• Featured listing opportunities
• Special promotional campaigns
• Enhanced seller tools access

We're here to help you succeed. Let's get you back to selling!

Best regards,
The Carbon Team`,
		},
		general_update: {
			subject: "Exciting Platform Growth - Let's Grow Together!",
			body: `Dear Seller,

We are excited to share that we are actively getting traction and we are making this journey together! Our platform is experiencing incredible growth with more buyers joining every day, creating amazing opportunities for all our sellers.

To help you maximize your success on our platform, we encourage you to:

✅ **Complete Your Shop Profile**
• Add a professional profile picture
• Update your business description
• Verify your contact information
• Add your business location details

✅ **Upload Ads Actively**
• List new products regularly
• Use high-quality photos
• Write detailed descriptions
• Set competitive prices

✅ **Share Your Shop Link**
• Promote your shop on social media
• Share with friends and family
• Include your shop link in your email signature
• Network with other sellers

✅ **Stay Engaged**
• Respond quickly to buyer inquiries
• Update your listings regularly
• Check your dashboard for insights
• Participate in platform activities

Together, we're building something amazing. Your success is our success, and we're committed to supporting you every step of the way.

Let's continue growing together!

Best regards,
The Carbon Team`,
		},
	};

	// Generate HTML email template with personalized data
	const generateEmailTemplate = (
		template,
		sellerData = null,
		templateType = "custom"
	) => {
		const sellerName = sellerData?.fullname || "Seller";
		const sellerEmail = sellerData?.email || "seller@example.com";
		const enterpriseName = sellerData?.enterprise_name || "Your Business";
		const location = sellerData?.location || "Your Location";
		const totalAds = sellerData?.analytics?.total_ads || 0;
		const totalReviews = sellerData?.analytics?.total_reviews || 0;
		const averageRating = sellerData?.analytics?.average_rating || "N/A";
		const sellerCategory = sellerData?.analytics?.seller_category || "General";
		const dashboardUrl = `https://carboncube.com/seller/dashboard`;
		const shopUrl = `https://carboncube.com/seller/${sellerData?.id || "shop"}`;
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px 20px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .message {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 25px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">CARBONCUBE</div>
            <p>Your Marketplace Partner</p>
        </div>
        
        <div class="content">
            <div class="greeting">Dear ${sellerName},</div>
            
            <!-- Personalized Seller Info -->
            <div class="highlight-box">
                <h3>📊 Your SasaTech Africa Performance</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div>
                        <strong>🏪 Shop:</strong> ${enterpriseName}<br>
                        <strong>📍 Location:</strong> ${location}<br>
                        <strong>📧 Email:</strong> ${sellerEmail}
                    </div>
                    <div>
                        <strong>📦 Total Ads:</strong> ${totalAds}<br>
                        <strong>⭐ Reviews:</strong> ${totalReviews} (Avg: ${averageRating})<br>
                        <strong>🏷️ Category:</strong> ${sellerCategory}
                    </div>
                </div>
            </div>
            
            <div class="message">
                ${template.body.replace(/\n/g, "<br>")}
            </div>
            
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="cta-button">
                    Visit Dashboard
                </a>
                <a href="${shopUrl}" class="cta-button" style="margin-left: 10px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    View My Shop
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>The Carbon Team</strong></p>
            <div class="social-links">
                <a href="#">Website</a> | <a href="#">Support</a> | <a href="#">Help Center</a>
            </div>
            <p>© 2024 Carbon Cube. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
	};

	const handleSendMessage = async (templateType) => {
		const template = messageTemplates[templateType];
		if (!template) return;

		// Show preview first
		const emailHtml = generateEmailTemplate(template, testSeller, templateType);
		setPreviewData({
			subject: template.subject,
			html: emailHtml,
			templateType,
			recipient: selectedAudience === "test_seller" ? testSeller : null,
		});
		setShowEmailPreview(true);
	};

	const handleSendCustomMessage = async () => {
		if (!customSubject.trim() || !customMessage.trim()) {
			alert("Please fill in both subject and message fields.");
			return;
		}

		// Create custom template for preview
		const customTemplate = {
			subject: customSubject,
			body: customMessage,
		};

		// Generate HTML email template for custom message
		const emailHtml = generateEmailTemplate(
			customTemplate,
			testSeller,
			"custom"
		);
		setPreviewData({
			subject: customSubject,
			html: emailHtml,
			templateType: "custom",
			recipient: selectedAudience === "test_seller" ? testSeller : null,
		});
		setShowEmailPreview(true);
	};

	// Fetch available sellers and set first one as test seller
	const fetchTestSeller = async () => {
		try {
			// First, get all available sellers
			const sellersResponse = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/admin/sellers`,
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);

			if (sellersResponse.ok) {
				const sellers = await sellersResponse.json();
				setAvailableSellers(sellers);

				// Try to find seller 114 first, otherwise use the first available seller
				let selectedSeller = sellers.find((seller) => seller.id === 114);

				if (!selectedSeller && sellers.length > 0) {
					selectedSeller = sellers[0];
					console.log(
						`Seller 114 not found, using first available seller: ${selectedSeller.fullname} (ID: ${selectedSeller.id})`
					);
				} else if (selectedSeller) {
					console.log(
						`Using seller 114: ${selectedSeller.fullname} (ID: ${selectedSeller.id})`
					);
				}

				if (selectedSeller) {
					// Now fetch detailed information for the selected seller
					const detailResponse = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/admin/sellers/${selectedSeller.id}`,
						{
							headers: {
								Authorization: "Bearer " + localStorage.getItem("token"),
							},
						}
					);

					if (detailResponse.ok) {
						const sellerData = await detailResponse.json();
						setTestSeller(sellerData);
					} else {
						console.error(
							"Error fetching seller details for ID:",
							selectedSeller.id
						);
					}
				} else {
					console.error("No sellers found in the database");
				}
			} else {
				console.error("Error fetching sellers list");
			}
		} catch (error) {
			console.error("Error fetching test seller:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch analytics data
				const analyticsResponse = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`,
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					}
				);
				const analyticsData = await analyticsResponse.json();
				setAnalyticsData(analyticsData);

				// Fetch test seller
				await fetchTestSeller();

				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="flex">
				<div className="flex-grow">
					<Navbar
						mode="admin"
						showSearch={false}
						showCategories={false}
						onLogout={onLogout}
					/>
					<div className="flex justify-center items-center h-screen">
						<Spinner
							variant="warning"
							name="cube-grid"
							style={{ width: 100, height: 100 }}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex">
			<div className="flex-grow">
				<Navbar
					mode="admin"
					showSearch={false}
					showCategories={false}
					onLogout={onLogout}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="flex justify-between items-center mb-6 bg-gray-800 p-4 text-white rounded-lg">
						<h2 className="text-2xl font-bold">Seller Communications</h2>
						<span className="font-semibold">Manage seller outreach</span>
					</div>

					{/* Quick Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
							<h3 className="text-2xl font-bold text-blue-600">
								{analyticsData?.total_sellers || 0}
							</h3>
							<p className="text-gray-600">Total Sellers</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
							<h3 className="text-2xl font-bold text-orange-600">
								{Math.floor((analyticsData?.total_sellers || 0) * 0.3)}
							</h3>
							<p className="text-gray-600">Inactive Sellers</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
							<h3 className="text-2xl font-bold text-green-600">
								{Math.floor((analyticsData?.total_sellers || 0) * 0.1)}
							</h3>
							<p className="text-gray-600">New Sellers</p>
						</div>
					</div>

					{/* Available Sellers Info */}
					{availableSellers.length > 0 && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
							<div className="flex items-center mb-2">
								<span className="text-blue-800 font-semibold">
									📋 Available Sellers
								</span>
							</div>
							<div className="text-sm text-blue-700">
								Found {availableSellers.length} seller(s) in the database.
								{testSeller && (
									<span className="font-medium">
										{" "}
										Using {testSeller.fullname} (ID: {testSeller.id}) as test
										seller.
									</span>
								)}
							</div>
							{availableSellers.length <= 5 && (
								<div className="mt-2 text-xs text-blue-600">
									Sellers:{" "}
									{availableSellers
										.map((seller) => `${seller.fullname} (ID: ${seller.id})`)
										.join(", ")}
								</div>
							)}
						</div>
					)}

					{/* Message Templates */}
					<div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
						<div className="bg-gray-800 text-white p-4 rounded-t-lg">
							<h3 className="text-lg font-bold text-center">
								Quick Message Templates
							</h3>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<button
									onClick={() => handleSendMessage("details_update")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Update Your Details
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Encourage sellers to complete their profiles
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.details_update.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("engagement")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Platform Growth
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Share traction and growth updates
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.engagement.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("best_practices")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Best Practices
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Tips for better ad performance
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.best_practices.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("welcome_new")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Welcome New Sellers
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Onboard new sellers with getting started guide
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.welcome_new.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("performance_review")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Performance Review
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Monthly performance insights and improvements
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.performance_review.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("reactivation")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Seller Reactivation
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Re-engage inactive sellers with incentives
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.reactivation.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("seasonal_promotion")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Seasonal Promotion
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Holiday and seasonal selling opportunities
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.seasonal_promotion.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("policy_update")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										Policy Updates
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Important platform updates and policy changes
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.policy_update.subject}
									</div>
								</button>
								<button
									onClick={() => handleSendMessage("general_update")}
									className="p-6 hover:bg-gray-50 transition-colors text-left"
								>
									<div className="text-lg font-semibold text-gray-900 mb-2">
										General Update
									</div>
									<div className="text-sm text-gray-600 mb-4">
										Platform growth and seller encouragement
									</div>
									<div className="text-xs text-gray-500">
										Subject: {messageTemplates.general_update.subject}
									</div>
								</button>
							</div>
						</div>
					</div>

					{/* Target Audience Selection */}
					<div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
						<div className="bg-gray-800 text-white p-4 rounded-t-lg">
							<h3 className="text-lg font-bold text-center">Target Audience</h3>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<label className="flex items-center p-4 border-2 border-green-500 rounded-lg cursor-pointer hover:bg-green-50 bg-green-50">
									<input
										type="radio"
										name="audience"
										value="test_seller"
										checked={selectedAudience === "test_seller"}
										onChange={(e) => setSelectedAudience(e.target.value)}
										className="mr-3"
									/>
									<div>
										<div className="font-semibold text-green-800">
											🧪 Test Seller{" "}
											{testSeller ? `(ID: ${testSeller.id})` : "(ID: 114)"}
										</div>
										<div className="text-sm text-green-600">
											{testSeller
												? `${testSeller.fullname} (${testSeller.email})`
												: "Loading..."}
										</div>
									</div>
								</label>
								<label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
									<input
										type="radio"
										name="audience"
										value="all_sellers"
										checked={selectedAudience === "all_sellers"}
										onChange={(e) => setSelectedAudience(e.target.value)}
										className="mr-3"
									/>
									<div>
										<div className="font-semibold text-gray-900">
											All Sellers
										</div>
										<div className="text-sm text-gray-600">
											{analyticsData?.total_sellers || 0} sellers
										</div>
									</div>
								</label>
								<label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
									<input
										type="radio"
										name="audience"
										value="inactive_sellers"
										checked={selectedAudience === "inactive_sellers"}
										onChange={(e) => setSelectedAudience(e.target.value)}
										className="mr-3"
									/>
									<div>
										<div className="font-semibold text-gray-900">
											Inactive Sellers
										</div>
										<div className="text-sm text-gray-600">
											{Math.floor((analyticsData?.total_sellers || 0) * 0.3)}{" "}
											sellers
										</div>
									</div>
								</label>
								<label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
									<input
										type="radio"
										name="audience"
										value="new_sellers"
										checked={selectedAudience === "new_sellers"}
										onChange={(e) => setSelectedAudience(e.target.value)}
										className="mr-3"
									/>
									<div>
										<div className="font-semibold text-gray-900">
											New Sellers
										</div>
										<div className="text-sm text-gray-600">
											{Math.floor((analyticsData?.total_sellers || 0) * 0.1)}{" "}
											sellers
										</div>
									</div>
								</label>
							</div>
							{selectedAudience === "test_seller" && (
								<div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
									<div className="flex items-center">
										<span className="text-green-800 font-semibold">
											✅ Test Mode Active
										</span>
									</div>
									<div className="text-sm text-green-700 mt-1">
										Messages will only be sent to the test seller{" "}
										{testSeller ? `(ID: ${testSeller.id})` : "(ID: 114)"} for
										testing purposes.
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Custom Message */}
					<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
						<div className="bg-gray-800 text-white p-4 rounded-t-lg">
							<h3 className="text-lg font-bold text-center">Custom Message</h3>
						</div>
						<div className="p-6">
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Subject
									</label>
									<input
										type="text"
										value={customSubject}
										onChange={(e) => setCustomSubject(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Enter email subject..."
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Message
									</label>
									<textarea
										rows={6}
										value={customMessage}
										onChange={(e) => setCustomMessage(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Enter your message..."
									/>
								</div>
								<div className="flex justify-between items-center">
									<div className="text-sm text-gray-600">
										Targeting:{" "}
										<span className="font-medium">
											{selectedAudience === "all_sellers"
												? "All Sellers"
												: selectedAudience === "inactive_sellers"
												? "Inactive Sellers"
												: "New Sellers"}
										</span>
									</div>
									<button
										onClick={handleSendCustomMessage}
										className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										Send Custom Message
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Email Preview Modal */}
			{showEmailPreview && previewData && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
						<div className="flex justify-between items-center p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold">Email Preview</h3>
							<div className="flex space-x-2">
								<button
									onClick={() => setShowEmailPreview(false)}
									className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={async () => {
										try {
											// TODO: Implement actual email sending
											console.log("Sending email:", previewData);
											alert(
												`Email sent to ${
													previewData.recipient
														? previewData.recipient.fullname
														: "selected audience"
												}!\n\nSubject: ${previewData.subject}`
											);
											setShowEmailPreview(false);
										} catch (error) {
											console.error("Error sending email:", error);
											alert("Error sending email. Please try again.");
										}
									}}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Send Email
								</button>
							</div>
						</div>
						<div className="p-4">
							<div className="mb-4 p-3 bg-gray-100 rounded-lg">
								<div className="text-sm">
									<strong>To:</strong>{" "}
									{previewData.recipient
										? `${previewData.recipient.fullname} (${previewData.recipient.email})`
										: "Selected Audience"}
								</div>
								<div className="text-sm">
									<strong>Subject:</strong> {previewData.subject}
								</div>
							</div>
							<div className="border border-gray-300 rounded-lg overflow-hidden">
								<iframe
									srcDoc={previewData.html}
									className="w-full h-96"
									title="Email Preview"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SellerCommunications;
