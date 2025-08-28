// src/components/TopNavbarMinimal.js
import React from "react";

const TopNavBarMinimal = () => {
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
						<a
							href="/seller/tiers"
							className="text-white hover:text-yellow-400 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
						>
							Tiers & Pricing
						</a>
						<a
							href="/terms-and-conditions"
							className="text-white hover:text-yellow-400 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
						>
							Terms & Conditions
						</a>
						<a
							href="/privacy"
							className="text-white hover:text-yellow-400 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
						>
							Privacy Policy
						</a>
						<a
							href="/about-us"
							className="text-white hover:text-yellow-400 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
						>
							About Us
						</a>
						<a
							href="/contact-us"
							className="text-white hover:text-yellow-400 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
						>
							Contact Us
						</a>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							className="w-8 h-8 flex items-center justify-center rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 transition-colors duration-200"
							aria-label="Toggle mobile menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default TopNavBarMinimal;
