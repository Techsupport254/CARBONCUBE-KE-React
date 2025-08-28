import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faTimes,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const TopNavbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		window.location.href = "/login";
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg border-b border-gray-700 w-full">
			<div className="w-full px-2 sm:px-4 lg:px-8">
				<div className="flex items-center justify-between h-12 sm:h-16">
					{/* Logo and Brand */}
					<div className="flex items-center">
						<div
							className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
							onClick={() => (window.location.href = "/")}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									window.location.href = "/";
								}
							}}
						>
							<img
								src={`${process.env.PUBLIC_URL}/logo.png`}
								alt="Carboncube Logo"
								className="h-6 w-6 sm:h-8 sm:w-8"
							/>
							<span className="font-bold text-lg sm:text-xl text-white">
								ARBONCUBE
							</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-2 lg:space-x-3">
						<button
							onClick={handleLogout}
							className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
						>
							<FontAwesomeIcon icon={faSignOutAlt} className="mr-1 sm:mr-2" />
							Sign out
						</button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={toggleMobileMenu}
							className="w-8 h-8 flex items-center justify-center rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 transition-colors duration-200"
							aria-label="Toggle mobile menu"
						>
							<FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-3 border-t border-gray-700">
							{/* Mobile Navigation */}
							<div className="space-y-2">
								<button
									onClick={handleLogout}
									className="flex items-center justify-center w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors duration-200"
								>
									<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
									Sign out
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default TopNavbar;
