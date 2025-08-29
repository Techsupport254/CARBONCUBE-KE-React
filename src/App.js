import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ForgotPassword from "./components/ForgotPassword";
import Terms from "./components/Terms";
import PrivacyPolicy from "./components/Privacy";

// Analytics Tracking Components
import MatomoTracker from "./components/MatomoTracker";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";
import {
	getDeviceFingerprint,
	isInternalUser,
} from "./utils/deviceFingerprint";

// Test Component
import AnalyticsTest from "./components/AnalyticsTest";

// Device Fingerprint Page
import DeviceFingerprint from "./pages/DeviceFingerprint";

// Admin Imports
import AnalyticsReporting from "./admin/pages/AnalyticsReporting";
import ContentManagement from "./admin/pages/ContentManagement";
import BuyersManagement from "./admin/pages/BuyersManagement";
import RidersManagement from "./admin/pages/RidersManagement";
import SellersManagement from "./admin/pages/SellersManagement";
import AdsManagement from "./admin/pages/AdsManagement";
import Messages from "./admin/pages/Messages";
import PromotionsDiscount from "./admin/pages/PromotionsDiscount";
import Notifications from "./admin/pages/Notifications";
import CategoriesManagement from "./admin/pages/CategoriesManagement";
import TiersManagement from "./admin/pages/TiersManagement";
import FingerprintRemovalRequests from "./admin/pages/FingerprintRemovalRequests";

// Seller Imports
import SellerSignUpPage from "./seller/pages/SellerSignUpPage";
import SellerAnalytics from "./seller/pages/SellerAnalytics";
import SellerAds from "./seller/pages/SellerAds";
import SellerMessages from "./seller/pages/Messages";
import SellerNotifications from "./seller/pages/SellerNotifications";
import SellerProfile from "./seller/pages/Profile";
import TierPage from "./seller/pages/Tiers";

// Buyer Imports
import Home from "./buyer/pages/Home";
import AdDetails from "./buyer/pages/AdDetails";
import WishList from "./buyer/pages/WishLists";
import BuyerMessages from "./buyer/pages/BuyerMessages";
import BuyerSignUpPage from "./buyer/pages/BuyerSignUpPage";
import ProfilePage from "./buyer/pages/Profile";
import RiderSignUpPage from "./rider/pages/RiderSignUpPage";
import PrivateRoute from "./components/PrivateRoute";

//sales imports
import SalesDashboard from "./sales/pages/SalesDashboard";

function App() {
	const [userRole, setUserRole] = useState(null); // For storing user role
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [excludeTracking, setExcludeTracking] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			const role = sessionStorage.getItem("userRole"); // Use 'userRole' here
			setUserRole(role);
			setIsAuthenticated(true);
		}
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
	return (
		<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			{/* Analytics Tracking Components */}
			{!excludeTracking && <MatomoTracker />}
			{!excludeTracking && <GoogleAnalyticsTracker />}

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
							path="sellers"
							element={<SellersManagement onLogout={handleLogout} />}
						/>
						<Route
							path="riders"
							element={<RidersManagement onLogout={handleLogout} />}
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
						<Route path="ads" element={<SellerAds onLogout={handleLogout} />} />
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
						<Route
							path="tiers"
							element={<TierPage onLogout={handleLogout} />}
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
						<Route path="home" element={<Home onLogout={handleLogout} />} />
						<Route
							path="wish_lists"
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
		</Router>
	);
}

export default App;
