import React, { useState, useEffect, Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { getDeviceFingerprint } from "./utils/deviceFingerprint";
import sourceTrackingService from "./utils/sourceTracking";
import useAuth from "./hooks/useAuth";
import tokenService from "./services/tokenService";
import Spinner from "react-spinkit";
import BecomeASeller from "./pages/BecomeASeller";

// Lazy load components for better performance
const LoginForm = lazy(() => import("./components/LoginForm"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const VendorHelp = lazy(() => import("./components/VendorHelp"));
const FAQs = lazy(() => import("./components/Faqs"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const Terms = lazy(() => import("./components/Terms"));
const PrivacyPolicy = lazy(() => import("./components/Privacy"));

// Analytics Tracking Components
const MatomoTracker = lazy(() => import("./components/MatomoTracker"));
const GoogleAnalyticsTracker = lazy(() =>
	import("./components/GoogleAnalyticsTracker")
);

// Test Component
const AnalyticsTest = lazy(() => import("./components/AnalyticsTest"));

// Device Fingerprint Page
const DeviceFingerprint = lazy(() => import("./pages/DeviceFingerprint"));
const HowToPay = lazy(() => import("./pages/HowToPay"));
const HowToShop = lazy(() => import("./pages/HowToShop"));

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
	const [isInitialized, setIsInitialized] = useState(true); // Always initialized since useAuth handles auth state

	useEffect(() => {
		// Determine if this device should be excluded from analytics trackers
		// and track the initial visit (only once per session)
		(async () => {
			try {
				const fp = getDeviceFingerprint();

				// Temporarily disable internal user check for testing
				// if (isInternalUser(fp)) {
				// 	setExcludeTracking(true);
				// 	return;
				// }

				const API_URL = process.env.REACT_APP_BACKEND_URL || "/api";

				const resp = await fetch(
					`${API_URL}/internal_user_exclusions/check/${fp.hash}`
				);
				if (resp.ok) {
					const data = await resp.json();
					if (
						(data && data.status === "approved") ||
						data?.is_excluded === true
					) {
						setExcludeTracking(true);
						return;
					}
				}
				setExcludeTracking(false);

				// Track the visit for analytics (only if not excluded)
				sourceTrackingService.trackVisit().catch((error) => {
					console.error("Source tracking failed:", error);
				});
			} catch (_) {
				setExcludeTracking(false);

				// Track the visit even if exclusion check fails
				sourceTrackingService.trackVisit().catch((error) => {
					console.error("Source tracking failed:", error);
				});
			}
		})();
	}, []);

	const handleLogin = (token, user) => {
		// Use tokenService to validate and store token
		if (!tokenService.setToken(token)) {
			console.error("Invalid token format, login failed");
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
				{/* Analytics Tracking Components */}
				{!excludeTracking && (
					<Suspense fallback={null}>
						<MatomoTracker />
						<GoogleAnalyticsTracker />
					</Suspense>
				)}

				<Suspense fallback={<LoadingSpinner />}>
					<Routes>
						<Route path="/ads/:adId" element={<AdDetails />} />
						<Route
							path="/ad/:adId"
							element={<Navigate to="/ads/:adId" replace />}
						/>
						<Route path="/shop/:slug" element={<ShopPage />} />
						<Route path="/categories" element={<CategoriesPage />} />
						<Route path="/" element={<Home onLogout={handleLogout} />} />
						<Route path="/home" element={<Navigate to="/" replace />} />
						<Route path="/admin" element={<Navigate to="/login" />} />
						<Route path="/seller" element={<Navigate to="/login" />} />
						<Route
							path="/login"
							element={<LoginForm onLogin={handleLogin} />}
						/>
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route
							path="/buyer-signup"
							element={<BuyerSignUpPage onSignup={handleBuyerSignup} />}
						/>
						<Route
							path="/seller-signup"
							element={<SellerSignUpPage onSignup={handleSellerSignup} />}
						/>
						<Route path="/seller/tiers" element={<TierPage />} />
						<Route path="/about-us" element={<AboutUs />} />
						<Route path="/contact-us" element={<ContactUs />} />
						<Route path="/vendor-help" element={<VendorHelp />} />
						<Route
							path="/seller-help"
							element={<Navigate to="/vendor-help" replace />}
						/>
						<Route path="/faqs" element={<FAQs />} />
						<Route path="/terms-and-conditions" element={<Terms />} />
						<Route path="/privacy" element={<PrivacyPolicy />} />
						<Route path="/analytics-test" element={<AnalyticsTest />} />
						<Route path="/seo-test" element={<SEOTest />} />
						<Route path="/fingerprint" element={<DeviceFingerprint />} />
						<Route path="/how-to-pay" element={<HowToPay />} />
						<Route path="/how-to-shop" element={<HowToShop />} />
						<Route path="/become-a-seller" element={<BecomeASeller />} />

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
								element={<AnalyticsReporting onLogout={handleLogout} />}
							/>
							<Route
								path="communications"
								element={<SellerCommunications onLogout={handleLogout} />}
							/>
							<Route
								path="content"
								element={<ContentManagement onLogout={handleLogout} />}
							/>
							<Route
								path="buyers"
								element={<BuyersManagement onLogout={handleLogout} />}
							/>
							<Route
								path="sellers"
								element={<SellersManagement onLogout={handleLogout} />}
							/>
							<Route
								path="ads"
								element={<AdsManagement onLogout={handleLogout} />}
							/>
							<Route
								path="messages"
								element={<Messages onLogout={handleLogout} />}
							/>
							<Route
								path="messages/:conversationId"
								element={<Messages onLogout={handleLogout} />}
							/>
							<Route
								path="promotions"
								element={<PromotionsDiscount onLogout={handleLogout} />}
							/>
							<Route
								path="notifications"
								element={<Notifications onLogout={handleLogout} />}
							/>
							<Route
								path="categories"
								element={<CategoriesManagement onLogout={handleLogout} />}
							/>
							<Route
								path="tiers"
								element={<TiersManagement onLogout={handleLogout} />}
							/>
							<Route
								path="fingerprint-requests"
								element={<FingerprintRemovalRequests onLogout={handleLogout} />}
							/>
							<Route
								path="profile"
								element={<AdminProfile onLogout={handleLogout} />}
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
								element={<SellerAnalytics onLogout={handleLogout} />}
							/>
							<Route
								path="ads"
								element={<SellerAds onLogout={handleLogout} />}
							/>
							<Route path="ads/:adId" element={<SellerAdDetails />} />
							<Route
								path="add-ad"
								element={<AddNewAd onLogout={handleLogout} />}
							/>
							<Route
								path="dashboard"
								element={<SellerShop onLogout={handleLogout} />}
							/>
							<Route
								path="messages"
								element={<SellerMessages onLogout={handleLogout} />}
							/>
							<Route
								path="messages/:conversationId"
								element={<SellerMessages onLogout={handleLogout} />}
							/>
							<Route
								path="notifications"
								element={<SellerNotifications onLogout={handleLogout} />}
							/>
							<Route
								path="profile"
								element={<SellerProfile onLogout={handleLogout} />}
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
								element={<WishList onLogout={handleLogout} />}
							/>
							<Route
								path="wish_lists"
								element={<WishList onLogout={handleLogout} />}
							/>
							<Route
								path="messages"
								element={<BuyerMessages onLogout={handleLogout} />}
							/>
							<Route
								path="messages/:conversationId"
								element={<BuyerMessages onLogout={handleLogout} />}
							/>
							<Route
								path="profile"
								element={<ProfilePage onLogout={handleLogout} />}
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
								element={<SalesDashboard onLogout={handleLogout} />}
							/>
						</Route>
					</Routes>
				</Suspense>
			</Router>
		</HelmetProvider>
	);
}

export default App;
