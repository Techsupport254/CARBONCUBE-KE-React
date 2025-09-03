import React, { useState, useEffect, Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import {
	getDeviceFingerprint,
	isInternalUser,
} from "./utils/deviceFingerprint";
import Spinner from "react-spinkit";

// Lazy load components for better performance
const LoginForm = lazy(() => import("./components/LoginForm"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));
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

// Admin Imports - Lazy loaded
const AnalyticsReporting = lazy(() =>
	import("./admin/pages/AnalyticsReporting")
);
const ContentManagement = lazy(() => import("./admin/pages/ContentManagement"));
const BuyersManagement = lazy(() => import("./admin/pages/BuyersManagement"));
const RidersManagement = lazy(() => import("./admin/pages/RidersManagement"));
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
const SellerMessages = lazy(() => import("./seller/pages/Messages"));
const SellerNotifications = lazy(() =>
	import("./seller/pages/SellerNotifications")
);
const SellerProfile = lazy(() => import("./seller/pages/Profile"));
const TierPage = lazy(() => import("./seller/pages/Tiers"));

// Buyer Imports - Lazy loaded
const Home = lazy(() => import("./buyer/pages/Home"));
const AdDetails = lazy(() => import("./buyer/pages/AdDetails"));
const WishList = lazy(() => import("./buyer/pages/WishLists"));
const BuyerMessages = lazy(() => import("./buyer/pages/BuyerMessages"));
const BuyerSignUpPage = lazy(() => import("./buyer/pages/BuyerSignUpPage"));
const ProfilePage = lazy(() => import("./buyer/pages/Profile"));
const RiderSignUpPage = lazy(() => import("./rider/pages/RiderSignUpPage"));
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
	const [userRole, setUserRole] = useState(null); // For storing user role
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [excludeTracking, setExcludeTracking] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize authentication state
	useEffect(() => {
		const initializeAuth = () => {
			const token = sessionStorage.getItem("token");
			if (token) {
				const role = sessionStorage.getItem("userRole");
				setUserRole(role);
				setIsAuthenticated(true);
			}
			setIsInitialized(true);
		};

		// Add cache-busting parameter to prevent stale data
		const urlParams = new URLSearchParams(window.location.search);
		const cacheBuster = urlParams.get("v");

		if (!cacheBuster) {
			// Add cache-busting parameter if not present
			const newUrl = new URL(window.location);
			newUrl.searchParams.set("v", Date.now());
			window.history.replaceState({}, "", newUrl);
		}

		initializeAuth();
	}, []);

	useEffect(() => {
		// Determine if this device should be excluded from analytics trackers
		(async () => {
			try {
				const fp = getDeviceFingerprint();
				if (isInternalUser(fp)) {
					setExcludeTracking(true);
					return;
				}
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
			} catch (_) {
				setExcludeTracking(false);
			}
		})();
	}, []);

	const handleLogin = (token, user) => {
		sessionStorage.setItem("token", token);
		sessionStorage.setItem("userRole", user.role);
		if (user.name) {
			sessionStorage.setItem("userName", user.name);
		}
		if (user.email) {
			sessionStorage.setItem("userEmail", user.email);
		}
		setUserRole(user.role);
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userRole");
		sessionStorage.removeItem("userName");
		sessionStorage.removeItem("userEmail");
		setUserRole(null);
		setIsAuthenticated(false);
	};

	const handleBuyerSignup = () => {
		setIsAuthenticated(true);
		setUserRole("buyer");
		sessionStorage.setItem("userRole", "buyer"); // Use 'userRole' here
	};

	const handleSellerSignup = () => {
		setIsAuthenticated(true);
		setUserRole("seller");
		sessionStorage.setItem("userRole", "seller"); // Use 'userRole' here
	};

	const handleRiderSignup = () => {
		setIsAuthenticated(true);
		setUserRole("rider");
		sessionStorage.setItem("userRole", "rider"); // Use 'userRole' here
	};

	// Don't render until authentication is initialized
	if (!isInitialized) {
		return <LoadingSpinner />;
	}

	return (
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
					<Route path="/home" element={<Home onLogout={handleLogout} />} />
					<Route path="/" element={<Home onLogout={handleLogout} />} />
					<Route path="/admin" element={<Navigate to="/login" />} />
					<Route path="/seller" element={<Navigate to="/login" />} />
					<Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route
						path="/buyer-signup"
						element={<BuyerSignUpPage onSignup={handleBuyerSignup} />}
					/>
					<Route
						path="/seller-signup"
						element={<SellerSignUpPage onSignup={handleSellerSignup} />}
					/>
					<Route
						path="/rider-signup"
						element={<RiderSignUpPage onSignup={handleRiderSignup} />}
					/>
					<Route path="/seller/tiers" element={<TierPage />} />
					<Route path="/about-us" element={<AboutUs />} />
					<Route path="/contact-us" element={<ContactUs />} />
					<Route path="/terms-and-conditions" element={<Terms />} />
					<Route path="/privacy" element={<PrivacyPolicy />} />
					<Route path="/analytics-test" element={<AnalyticsTest />} />
					<Route path="/fingerprint" element={<DeviceFingerprint />} />

					{isAuthenticated && userRole === "admin" && (
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
								path="content"
								element={<ContentManagement onLogout={handleLogout} />}
							/>
							<Route
								path="buyers"
								element={<BuyersManagement onLogout={handleLogout} />}
							/>
							<Route
								path="riders"
								element={<RidersManagement onLogout={handleLogout} />}
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
					)}

					{isAuthenticated && userRole === "seller" && (
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
							<Route
								path="messages"
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
					)}

					{isAuthenticated && userRole === "buyer" && (
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
							<Route
								path="wishlist"
								element={<WishList onLogout={handleLogout} />}
							/>
							<Route
								path="messages"
								element={<BuyerMessages onLogout={handleLogout} />}
							/>
							<Route
								path="profile"
								element={<ProfilePage onLogout={handleLogout} />}
							/>
						</Route>
					)}

					{isAuthenticated && userRole === "sales" && (
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
					)}
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
