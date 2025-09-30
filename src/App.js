import React, { useState, useEffect, Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
	getDeviceFingerprint,
	isInternalUser,
	isIPExcluded,
} from "./utils/deviceFingerprint";
import sourceTrackingService from "./utils/sourceTracking";
import useAuth from "./hooks/useAuth";
import tokenService from "./services/tokenService";
import Spinner from "react-spinkit";
import BecomeASeller from "./pages/BecomeASeller";

// SEO Components
import PageSEO from "./components/PageSEO";
import StaticPageSEO from "./components/StaticPageSEO";
import AuthPageSEO from "./components/AuthPageSEO";
import HelpPageSEO from "./components/HelpPageSEO";
import CategoryPageSEO from "./components/CategoryPageSEO";

// Lazy load components for better performance
const LoginForm = lazy(() => import("./components/LoginForm"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const VendorHelp = lazy(() => import("./components/VendorHelp"));
const FAQs = lazy(() => import("./components/Faqs"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const Terms = lazy(() => import("./components/Terms"));
const PrivacyPolicy = lazy(() => import("./components/Privacy"));
const DataDeletion = lazy(() => import("./components/DataDeletion"));
const NotFound = lazy(() => import("./components/NotFound"));

// Analytics Tracking Components - Deferred loading
const DeferredAnalytics = lazy(() => import("./components/DeferredAnalytics"));
const PerformanceMonitor = lazy(() =>
	import("./components/PerformanceMonitor")
);

// Test Component
const AnalyticsTest = lazy(() => import("./components/AnalyticsTest"));

// Device Fingerprint Page
const DeviceFingerprint = lazy(() => import("./pages/DeviceFingerprint"));
const HowToPay = lazy(() => import("./pages/HowToPay"));
const HowToShop = lazy(() => import("./pages/HowToShop"));

// Location Pages
const LocationPage = lazy(() => import("./pages/LocationPage"));

// SEO Test Component
const SEOTest = lazy(() => import("./components/SEOValidationTest"));

// Admin Imports - Lazy loaded
const AnalyticsReporting = lazy(() =>
	import("./admin/pages/AnalyticsReporting")
);
const SellerCommunications = lazy(() =>
	import("./admin/pages/SellerCommunications")
);
const ContentManagement = lazy(() => import("./admin/pages/ContentManagement"));
const BuyersManagement = lazy(() => import("./admin/pages/BuyersManagement"));
const SellersManagement = lazy(() => import("./admin/pages/SellersManagement"));
const AdsManagement = lazy(() => import("./admin/pages/AdsManagement"));
const Messages = lazy(() => import("./admin/pages/Messages"));
const PromotionsDiscount = lazy(() =>
	import("./admin/pages/PromotionsDiscount")
);
const Notifications = lazy(() => import("./admin/pages/Notifications"));
const CategoriesManagement = lazy(() =>
	import("./admin/pages/CategoriesManagement")
);
const TiersManagement = lazy(() => import("./admin/pages/TiersManagement"));
const FingerprintRemovalRequests = lazy(() =>
	import("./admin/pages/FingerprintRemovalRequests")
);
const AdminProfile = lazy(() => import("./admin/pages/Profile"));

// Seller Imports - Lazy loaded
const SellerSignUpPage = lazy(() => import("./seller/pages/SellerSignUpPage"));
const SellerAnalytics = lazy(() => import("./seller/pages/SellerAnalytics"));
const SellerAds = lazy(() => import("./seller/pages/SellerAds"));
const SellerAdDetails = lazy(() => import("./seller/pages/SellerAdDetails"));
const SellerShop = lazy(() => import("./seller/pages/SellerShop"));
const SellerMessages = lazy(() => import("./seller/pages/SellerMessages"));
const SellerNotifications = lazy(() =>
	import("./seller/pages/SellerNotifications")
);
const SellerProfile = lazy(() => import("./seller/pages/Profile"));
const TierPage = lazy(() => import("./seller/pages/Tiers"));
const AddNewAd = lazy(() => import("./seller/pages/AddNewAd"));

// Buyer Imports - Lazy loaded
const Home = lazy(() => import("./buyer/pages/Home"));
const ShopPage = lazy(() => import("./buyer/pages/ShopPage"));
const AdDetails = lazy(() => import("./buyer/pages/AdDetails"));
const WishList = lazy(() => import("./buyer/pages/WishLists"));
const BuyerMessages = lazy(() => import("./buyer/pages/BuyerMessages"));
const BuyerSignUpPage = lazy(() => import("./buyer/pages/BuyerSignUpPage"));
const ProfilePage = lazy(() => import("./buyer/pages/Profile"));
const CategoriesPage = lazy(() => import("./buyer/pages/CategoriesPage"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));

//sales imports - Lazy loaded
const SalesDashboard = lazy(() => import("./sales/pages/SalesDashboard"));

// SEO Wrapper Components
const AboutUsWithSEO = () => (
	<>
		<StaticPageSEO pageType="about" />
		<AboutUs />
	</>
);

const ContactUsWithSEO = () => (
	<>
		<StaticPageSEO pageType="contact" />
		<ContactUs />
	</>
);

const TermsWithSEO = () => (
	<>
		<StaticPageSEO pageType="terms" />
		<Terms />
	</>
);

const PrivacyWithSEO = () => (
	<>
		<StaticPageSEO pageType="privacy" />
		<PrivacyPolicy />
	</>
);

const DataDeletionWithSEO = () => (
	<>
		<StaticPageSEO pageType="data-deletion" />
		<DataDeletion />
	</>
);

const LoginFormWithSEO = ({ onLogin }) => (
	<>
		<AuthPageSEO pageType="login" />
		<LoginForm onLogin={onLogin} />
	</>
);

const ForgotPasswordWithSEO = () => (
	<>
		<AuthPageSEO pageType="forgotPassword" />
		<ForgotPassword />
	</>
);

const BuyerSignUpPageWithSEO = ({ onSignup }) => (
	<>
		<AuthPageSEO pageType="buyerSignup" />
		<BuyerSignUpPage onSignup={onSignup} />
	</>
);

const SellerSignUpPageWithSEO = ({ onSignup }) => (
	<>
		<AuthPageSEO pageType="sellerSignup" />
		<SellerSignUpPage onSignup={onSignup} />
	</>
);

const FAQsWithSEO = () => (
	<>
		<HelpPageSEO pageType="faqs" />
		<FAQs />
	</>
);

const VendorHelpWithSEO = () => (
	<>
		<HelpPageSEO pageType="vendorHelp" />
		<VendorHelp />
	</>
);

const HowToPayWithSEO = () => (
	<>
		<HelpPageSEO pageType="howToPay" />
		<HowToPay />
	</>
);

const HowToShopWithSEO = () => (
	<>
		<HelpPageSEO pageType="howToShop" />
		<HowToShop />
	</>
);

const BecomeASellerWithSEO = () => (
	<>
		<HelpPageSEO pageType="becomeSeller" />
		<BecomeASeller />
	</>
);

const CategoriesPageWithSEO = () => (
	<>
		<CategoryPageSEO pageType="categories" />
		<CategoriesPage />
	</>
);

const TierPageWithSEO = () => (
	<>
		<PageSEO
			pageType="sellerTiers"
			title="Seller Tiers & Benefits | Carbon Cube Kenya | Choose Your Plan"
			description="Discover Carbon Cube Kenya's comprehensive seller tier system. Compare Bronze, Silver, Gold, and Platinum tiers with their exclusive benefits, pricing, and features to maximize your online business growth in Kenya."
			keywords="seller tiers Kenya, vendor tiers Carbon Cube, premium seller features, business growth Kenya, marketplace benefits, seller benefits Kenya, Bronze tier, Silver tier, Gold tier, Platinum tier, seller subscription, online business Kenya, e-commerce tiers, seller plans Kenya"
		/>
		<TierPage />
	</>
);

// SEO for Dashboard Pages
const SalesDashboardWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="salesDashboard"
			title="Sales Dashboard | Carbon Cube Kenya"
			description="Access your Carbon Cube Kenya sales dashboard to track performance, manage leads, and grow your business on Kenya's trusted marketplace."
			keywords="sales dashboard, business analytics, performance tracking, sales management, Carbon Cube Kenya"
		/>
		<SalesDashboard onLogout={onLogout} />
	</>
);

const SellerAnalyticsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerAnalytics"
			title="Seller Analytics | Carbon Cube Kenya"
			description="Track your sales performance, customer insights, and business growth with Carbon Cube Kenya seller analytics dashboard."
			keywords="seller analytics, sales performance, business insights, seller dashboard, performance tracking"
		/>
		<SellerAnalytics onLogout={onLogout} />
	</>
);

const SellerAdsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerAds"
			title="Manage Your Ads | Carbon Cube Kenya Seller Dashboard"
			description="Manage your product listings, track ad performance, and optimize your sales on Carbon Cube Kenya seller dashboard."
			keywords="manage ads, product listings, seller dashboard, ad management, product optimization"
		/>
		<SellerAds onLogout={onLogout} />
	</>
);

const SellerShopWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerShop"
			title="My Shop Dashboard | Carbon Cube Kenya"
			description="Manage your shop, track orders, and grow your business with Carbon Cube Kenya seller shop dashboard."
			keywords="shop dashboard, seller shop, order management, business growth, shop analytics"
		/>
		<SellerShop onLogout={onLogout} />
	</>
);

const AdminAnalyticsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminAnalytics"
			title="Admin Analytics | Carbon Cube Kenya"
			description="Comprehensive analytics dashboard for Carbon Cube Kenya administrators to track platform performance and user engagement."
			keywords="admin analytics, platform analytics, user engagement, performance metrics, admin dashboard"
		/>
		<AnalyticsReporting onLogout={onLogout} />
	</>
);

// Admin SEO Wrapper Components
const AdminCommunicationsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminCommunications"
			title="Seller Communications | Carbon Cube Kenya Admin"
			description="Manage seller communications and support tickets on Carbon Cube Kenya admin dashboard."
			keywords="admin communications, seller support, customer service, admin dashboard, Carbon Cube Kenya"
		/>
		<SellerCommunications onLogout={onLogout} />
	</>
);

const AdminContentWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminContent"
			title="Content Management | Carbon Cube Kenya Admin"
			description="Manage platform content, categories, and user-generated content on Carbon Cube Kenya admin dashboard."
			keywords="content management, admin dashboard, platform content, content moderation, Carbon Cube Kenya"
		/>
		<ContentManagement onLogout={onLogout} />
	</>
);

const AdminBuyersWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminBuyers"
			title="Buyers Management | Carbon Cube Kenya Admin"
			description="Manage buyer accounts, profiles, and activities on Carbon Cube Kenya admin dashboard."
			keywords="buyers management, admin dashboard, user management, buyer accounts, Carbon Cube Kenya"
		/>
		<BuyersManagement onLogout={onLogout} />
	</>
);

const AdminSellersWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminSellers"
			title="Sellers Management | Carbon Cube Kenya Admin"
			description="Manage seller accounts, verification, and business profiles on Carbon Cube Kenya admin dashboard."
			keywords="sellers management, admin dashboard, seller verification, business profiles, Carbon Cube Kenya"
		/>
		<SellersManagement onLogout={onLogout} />
	</>
);

const AdminAdsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminAds"
			title="Ads Management | Carbon Cube Kenya Admin"
			description="Manage product listings, ad approvals, and marketplace content on Carbon Cube Kenya admin dashboard."
			keywords="ads management, admin dashboard, product listings, ad moderation, Carbon Cube Kenya"
		/>
		<AdsManagement onLogout={onLogout} />
	</>
);

const AdminMessagesWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminMessages"
			title="Messages Management | Carbon Cube Kenya Admin"
			description="Monitor and manage user communications and support messages on Carbon Cube Kenya admin dashboard."
			keywords="messages management, admin dashboard, user communications, support messages, Carbon Cube Kenya"
		/>
		<Messages onLogout={onLogout} />
	</>
);

const AdminPromotionsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminPromotions"
			title="Promotions & Discounts | Carbon Cube Kenya Admin"
			description="Manage platform promotions, discounts, and marketing campaigns on Carbon Cube Kenya admin dashboard."
			keywords="promotions management, admin dashboard, discounts, marketing campaigns, Carbon Cube Kenya"
		/>
		<PromotionsDiscount onLogout={onLogout} />
	</>
);

const AdminNotificationsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminNotifications"
			title="Notifications Management | Carbon Cube Kenya Admin"
			description="Manage platform notifications and user alerts on Carbon Cube Kenya admin dashboard."
			keywords="notifications management, admin dashboard, user alerts, platform notifications, Carbon Cube Kenya"
		/>
		<Notifications onLogout={onLogout} />
	</>
);

const AdminCategoriesWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminCategories"
			title="Categories Management | Carbon Cube Kenya Admin"
			description="Manage product categories and marketplace organization on Carbon Cube Kenya admin dashboard."
			keywords="categories management, admin dashboard, product categories, marketplace organization, Carbon Cube Kenya"
		/>
		<CategoriesManagement onLogout={onLogout} />
	</>
);

const AdminTiersWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminTiers"
			title="Tiers Management | Carbon Cube Kenya Admin"
			description="Manage seller tiers and subscription plans on Carbon Cube Kenya admin dashboard."
			keywords="tiers management, admin dashboard, seller tiers, subscription plans, Carbon Cube Kenya"
		/>
		<TiersManagement onLogout={onLogout} />
	</>
);

const AdminFingerprintWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminFingerprint"
			title="Fingerprint Requests | Carbon Cube Kenya Admin"
			description="Manage device fingerprint removal requests on Carbon Cube Kenya admin dashboard."
			keywords="fingerprint requests, admin dashboard, device fingerprint, privacy requests, Carbon Cube Kenya"
		/>
		<FingerprintRemovalRequests onLogout={onLogout} />
	</>
);

const AdminProfileWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="adminProfile"
			title="Admin Profile | Carbon Cube Kenya"
			description="Manage your admin profile and account settings on Carbon Cube Kenya."
			keywords="admin profile, account settings, admin dashboard, profile management, Carbon Cube Kenya"
		/>
		<AdminProfile onLogout={onLogout} />
	</>
);

// Seller SEO Wrapper Components
const SellerMessagesWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerMessages"
			title="Messages | Carbon Cube Kenya Seller Dashboard"
			description="Manage your customer conversations and inquiries on Carbon Cube Kenya seller dashboard."
			keywords="seller messages, customer conversations, seller dashboard, customer support, Carbon Cube Kenya"
		/>
		<SellerMessages onLogout={onLogout} />
	</>
);

const SellerNotificationsWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerNotifications"
			title="Notifications | Carbon Cube Kenya Seller Dashboard"
			description="Stay updated with your business notifications and alerts on Carbon Cube Kenya seller dashboard."
			keywords="seller notifications, business alerts, seller dashboard, notifications, Carbon Cube Kenya"
		/>
		<SellerNotifications onLogout={onLogout} />
	</>
);

const SellerProfileWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="sellerProfile"
			title="My Profile | Carbon Cube Kenya Seller Dashboard"
			description="Manage your seller profile and business information on Carbon Cube Kenya."
			keywords="seller profile, business profile, seller dashboard, profile management, Carbon Cube Kenya"
		/>
		<SellerProfile onLogout={onLogout} />
	</>
);

const AddNewAdWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="addNewAd"
			title="Add New Ad | Carbon Cube Kenya Seller Dashboard"
			description="Create and publish new product listings on Carbon Cube Kenya seller dashboard."
			keywords="add new ad, create listing, product listing, seller dashboard, Carbon Cube Kenya"
		/>
		<AddNewAd onLogout={onLogout} />
	</>
);

const SellerAdDetailsWithSEO = () => (
	<>
		<PageSEO
			pageType="sellerAdDetails"
			title="Ad Details | Carbon Cube Kenya Seller Dashboard"
			description="View and manage your product listing details on Carbon Cube Kenya seller dashboard."
			keywords="ad details, product listing, seller dashboard, ad management, Carbon Cube Kenya"
		/>
		<SellerAdDetails />
	</>
);

// Buyer SEO Wrapper Components
const BuyerWishListWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="buyerWishList"
			title="My Wishlist | Carbon Cube Kenya"
			description="Save and manage your favorite products on Carbon Cube Kenya wishlist."
			keywords="wishlist, favorite products, saved items, buyer dashboard, Carbon Cube Kenya"
		/>
		<WishList onLogout={onLogout} />
	</>
);

const BuyerMessagesWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="buyerMessages"
			title="Messages | Carbon Cube Kenya"
			description="Communicate with sellers and manage your conversations on Carbon Cube Kenya."
			keywords="buyer messages, seller communication, conversations, buyer dashboard, Carbon Cube Kenya"
		/>
		<BuyerMessages onLogout={onLogout} />
	</>
);

const BuyerProfileWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="buyerProfile"
			title="My Profile | Carbon Cube Kenya"
			description="Manage your buyer profile and account settings on Carbon Cube Kenya."
			keywords="buyer profile, account settings, profile management, buyer dashboard, Carbon Cube Kenya"
		/>
		<ProfilePage onLogout={onLogout} />
	</>
);

// Test/Utility SEO Wrapper Components
const AnalyticsTestWithSEO = () => (
	<>
		<PageSEO
			pageType="analyticsTest"
			title="Analytics Test | Carbon Cube Kenya"
			description="Analytics testing page for Carbon Cube Kenya development and debugging."
			keywords="analytics test, development tools, debugging, Carbon Cube Kenya"
		/>
		<AnalyticsTest />
	</>
);

const SEOTestWithSEO = () => (
	<>
		<PageSEO
			pageType="seoTest"
			title="SEO Test | Carbon Cube Kenya"
			description="SEO testing and validation page for Carbon Cube Kenya development."
			keywords="SEO test, development tools, SEO validation, Carbon Cube Kenya"
		/>
		<SEOTest />
	</>
);

const DeviceFingerprintWithSEO = () => (
	<>
		<PageSEO
			pageType="deviceFingerprint"
			title="Device Fingerprint | Carbon Cube Kenya"
			description="Device fingerprint information and privacy settings for Carbon Cube Kenya."
			keywords="device fingerprint, privacy settings, device information, Carbon Cube Kenya"
		/>
		<DeviceFingerprint />
	</>
);

// Home Page SEO Wrapper
const HomeWithSEO = ({ onLogout }) => (
	<>
		<PageSEO
			pageType="home"
			title="Carbon Cube Kenya - Kenya's #1 Online Marketplace | Trusted Sellers & Buyers"
			description="Carbon Cube Kenya is Kenya's most trusted and secure online marketplace, connecting verified sellers with buyers using AI-powered tools and seamless digital procurement. Discover thousands of products from verified sellers across Kenya with secure payment and fast delivery."
			keywords="Carbon Cube Kenya, online marketplace Kenya, trusted sellers, secure ecommerce, AI-powered marketplace, digital procurement Kenya, seller verification, sustainable sourcing Kenya, online shopping Kenya, B2B marketplace, buy online Kenya, shop online Nairobi, automotive parts Kenya, computer parts Kenya, filtration systems Kenya, hardware tools Kenya, auto parts shop Kenya, computer accessories Kenya, filters Kenya, power tools Kenya, car parts Kenya, IT equipment Kenya, industrial supplies Kenya, verified suppliers, business growth Kenya, secure online shopping Kenya, fast delivery Kenya"
		/>
		<Home onLogout={onLogout} />
	</>
);

// Shop Page SEO Wrapper
const ShopPageWithSEO = () => (
	<>
		<PageSEO
			pageType="shop"
			title="Shop Online | Carbon Cube Kenya Marketplace"
			description="Browse and shop from thousands of verified products on Carbon Cube Kenya. Find automotive parts, computer accessories, hardware tools, and more from trusted sellers across Kenya."
			keywords="shop online Kenya, marketplace shopping, verified products, automotive parts Kenya, computer accessories Kenya, hardware tools Kenya, online shopping, Carbon Cube Kenya"
		/>
		<ShopPage />
	</>
);

// Ad Details SEO Wrapper
const AdDetailsWithSEO = () => (
	<>
		<PageSEO
			pageType="product"
			title="Product Details | Carbon Cube Kenya"
			description="View detailed product information, specifications, and seller details on Carbon Cube Kenya. Secure payment and fast delivery across Kenya."
			keywords="product details, product information, seller details, secure payment, fast delivery, Carbon Cube Kenya"
		/>
		<AdDetails />
	</>
);

// Location Page SEO Wrapper
const LocationPageWithSEO = () => (
	<>
		<PageSEO
			pageType="location"
			title="Local Products | Carbon Cube Kenya"
			description="Find products and sellers in your local area on Carbon Cube Kenya. Discover local businesses and products available near you."
			keywords="local products, local sellers, location-based shopping, local marketplace, Carbon Cube Kenya"
		/>
		<LocationPage />
	</>
);

// NotFound Page SEO Wrapper
const NotFoundWithSEO = () => (
	<>
		<PageSEO
			pageType="notFound"
			title="Page Not Found | Carbon Cube Kenya"
			description="The page you're looking for doesn't exist. Return to Carbon Cube Kenya homepage to continue shopping."
			keywords="page not found, 404 error, Carbon Cube Kenya"
		/>
		<NotFound />
	</>
);

// Loading component for Suspense fallback
const LoadingSpinner = () => (
	<div className="flex items-center justify-center min-h-screen w-full">
		<Spinner
			variant="warning"
			name="cube-grid"
			style={{ width: 60, height: 60 }}
		/>
	</div>
);

function App() {
	const { isAuthenticated, userRole, logout } = useAuth();
	const [excludeTracking, setExcludeTracking] = useState(false);
	const isInitialized = true; // Always initialized since useAuth handles auth state

	const handleLogin = (token, user) => {
		// Use tokenService to validate and store token
		if (!tokenService.setToken(token)) {
			return;
		}

		// Store user data in localStorage
		localStorage.setItem("userRole", user.role);
		if (user.name) {
			localStorage.setItem("userName", user.name);
		}
		if (user.username) {
			localStorage.setItem("userUsername", user.username);
		}
		if (user.email) {
			localStorage.setItem("userEmail", user.email);
		}
		if (user.profile_picture) {
			localStorage.setItem("userProfilePicture", user.profile_picture);
		}

		// Dispatch storage event to trigger useAuth to update
		window.dispatchEvent(
			new StorageEvent("storage", {
				key: "token",
				newValue: token,
			})
		);
	};

	useEffect(() => {
		// Determine if this device should be excluded from analytics trackers
		// and track the initial visit (only once per session)
		(async () => {
			try {
				const fp = await getDeviceFingerprint();

				// Check for internal user patterns first
				if (isInternalUser(fp)) {
					setExcludeTracking(true);
					return;
				}

				// Check for IP-based exclusions
				const ipExcluded = await isIPExcluded();
				if (ipExcluded) {
					setExcludeTracking(true);
					return;
				}

				const API_URL = process.env.REACT_APP_BACKEND_URL;

				const resp = await fetch(
					`${API_URL}/internal_user_exclusions/check/${fp.hash}`
				);
				if (resp.ok) {
					const data = await resp.json();
					if (data && data.status === "approved") {
						setExcludeTracking(true);
						return;
					}
				}
				setExcludeTracking(false);

				// Track the visit for analytics (only if not excluded)
				sourceTrackingService.trackVisit().catch((error) => {
					// Source tracking failed silently
				});
			} catch (_) {
				setExcludeTracking(false);

				// Track the visit even if exclusion check fails
				sourceTrackingService.trackVisit().catch((error) => {
					// Source tracking failed silently
				});
			}
		})();
	}, []);

	const handleLogout = () => {
		// Use the logout function from useAuth hook
		logout();
	};

	const handleBuyerSignup = () => {
		// This will be handled by the signup process
		// The actual authentication will happen after successful signup
	};

	const handleSellerSignup = () => {
		// This will be handled by the signup process
		// The actual authentication will happen after successful signup
	};

	// Don't render until authentication is initialized
	if (!isInitialized) {
		return <LoadingSpinner />;
	}

	return (
		<HelmetProvider>
			<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<AppContent
					isAuthenticated={isAuthenticated}
					userRole={userRole}
					handleLogin={handleLogin}
					handleLogout={handleLogout}
					handleBuyerSignup={handleBuyerSignup}
					handleSellerSignup={handleSellerSignup}
					excludeTracking={excludeTracking}
				/>
			</Router>
		</HelmetProvider>
	);
}

// Component that uses Router context
function AppContent({
	isAuthenticated,
	userRole,
	handleLogin,
	handleLogout,
	handleBuyerSignup,
	handleSellerSignup,
	excludeTracking,
}) {
	return (
		<>
			{/* Analytics Tracking Components */}
			{!excludeTracking && (
				<Suspense fallback={null}>
					<DeferredAnalytics />
					<PerformanceMonitor />
				</Suspense>
			)}

			<Suspense fallback={<LoadingSpinner />}>
				<Routes>
					<Route path="/ads/:slug" element={<AdDetailsWithSEO />} />
					<Route
						path="/ad/:adId"
						element={<Navigate to="/ads/:adId" replace />}
					/>
					<Route path="/shop/:slug" element={<ShopPageWithSEO />} />
					<Route path="/categories" element={<CategoriesPageWithSEO />} />
					<Route path="/" element={<HomeWithSEO onLogout={handleLogout} />} />
					<Route path="/home" element={<Navigate to="/" replace />} />
					<Route path="/admin" element={<Navigate to="/login" />} />
					<Route path="/seller" element={<Navigate to="/login" />} />
					<Route
						path="/login"
						element={<LoginFormWithSEO onLogin={handleLogin} />}
					/>
					<Route
						path="/auth/google_oauth2/callback"
						element={<LoginFormWithSEO onLogin={handleLogin} />}
					/>
					<Route
						path="/auth/google/callback"
						element={<LoginFormWithSEO onLogin={handleLogin} />}
					/>
					<Route path="/forgot-password" element={<ForgotPasswordWithSEO />} />
					<Route
						path="/buyer-signup"
						element={<BuyerSignUpPageWithSEO onSignup={handleBuyerSignup} />}
					/>
					<Route
						path="/seller-signup"
						element={<SellerSignUpPageWithSEO onSignup={handleSellerSignup} />}
					/>
					<Route path="/seller/tiers" element={<TierPageWithSEO />} />
					<Route path="/about-us" element={<AboutUsWithSEO />} />
					<Route path="/contact-us" element={<ContactUsWithSEO />} />
					<Route path="/vendor-help" element={<VendorHelpWithSEO />} />
					<Route
						path="/seller-help"
						element={<Navigate to="/vendor-help" replace />}
					/>
					<Route path="/faqs" element={<FAQsWithSEO />} />
					<Route path="/terms-and-conditions" element={<TermsWithSEO />} />
					<Route path="/privacy" element={<PrivacyWithSEO />} />
					<Route path="/data-deletion" element={<DataDeletionWithSEO />} />
					<Route path="/analytics-test" element={<AnalyticsTestWithSEO />} />
					<Route path="/seo-test" element={<SEOTestWithSEO />} />
					<Route path="/fingerprint" element={<DeviceFingerprintWithSEO />} />
					<Route path="/how-to-pay" element={<HowToPayWithSEO />} />
					<Route path="/how-to-shop" element={<HowToShopWithSEO />} />
					<Route path="/become-a-seller" element={<BecomeASellerWithSEO />} />

					{/* Location-specific routes for local SEO */}
					<Route path="/location/:location" element={<LocationPageWithSEO />} />

					{/* Admin Routes */}
					<Route
						path="/admin/*"
						element={
							<PrivateRoute
								isAuthenticated={isAuthenticated}
								role="admin"
								userRole={userRole}
							/>
						}
					>
						<Route
							path="analytics"
							element={<AdminAnalyticsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="communications"
							element={<AdminCommunicationsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="content"
							element={<AdminContentWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="buyers"
							element={<AdminBuyersWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="sellers"
							element={<AdminSellersWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="ads"
							element={<AdminAdsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages"
							element={<AdminMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages/:conversationId"
							element={<AdminMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="promotions"
							element={<AdminPromotionsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="notifications"
							element={<AdminNotificationsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="categories"
							element={<AdminCategoriesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="tiers"
							element={<AdminTiersWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="fingerprint-requests"
							element={<AdminFingerprintWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="profile"
							element={<AdminProfileWithSEO onLogout={handleLogout} />}
						/>
					</Route>

					{/* Seller Routes */}
					<Route
						path="/seller/*"
						element={
							<PrivateRoute
								isAuthenticated={isAuthenticated}
								role="seller"
								userRole={userRole}
							/>
						}
					>
						<Route
							path="analytics"
							element={<SellerAnalyticsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="ads"
							element={<SellerAdsWithSEO onLogout={handleLogout} />}
						/>
						<Route path="ads/:adId" element={<SellerAdDetailsWithSEO />} />
						<Route
							path="add-ad"
							element={<AddNewAdWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="dashboard"
							element={<SellerShopWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages"
							element={<SellerMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages/:conversationId"
							element={<SellerMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="notifications"
							element={<SellerNotificationsWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="profile"
							element={<SellerProfileWithSEO onLogout={handleLogout} />}
						/>
					</Route>

					{/* Buyer Routes */}
					<Route
						path="/buyer/*"
						element={
							<PrivateRoute
								isAuthenticated={isAuthenticated}
								role="buyer"
								userRole={userRole}
							/>
						}
					>
						<Route path="home" element={<Navigate to="/" replace />} />
						<Route
							path="wishlist"
							element={<BuyerWishListWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="wish_lists"
							element={<BuyerWishListWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages"
							element={<BuyerMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="messages/:conversationId"
							element={<BuyerMessagesWithSEO onLogout={handleLogout} />}
						/>
						<Route
							path="profile"
							element={<BuyerProfileWithSEO onLogout={handleLogout} />}
						/>
					</Route>

					{/* Sales Routes */}
					<Route
						path="/sales/*"
						element={
							<PrivateRoute
								isAuthenticated={isAuthenticated}
								role="sales"
								userRole={userRole}
							/>
						}
					>
						<Route
							path="dashboard"
							element={<SalesDashboardWithSEO onLogout={handleLogout} />}
						/>
					</Route>

					{/* 404 Page - Catch all route */}
					<Route path="*" element={<NotFoundWithSEO />} />
				</Routes>
			</Suspense>
		</>
	);
}

export default App;
