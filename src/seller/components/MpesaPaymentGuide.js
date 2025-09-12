import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMobile,
	faCreditCard,
	faCheckCircle,
	faPhone,
	faMoneyBillWave,
	faLock,
} from "@fortawesome/free-solid-svg-icons";

const MpesaPaymentGuide = () => {
	const [selectedMethod, setSelectedMethod] = useState("manual");
	const paymentSteps = [
		{
			step: 1,
			title: "Go to M-Pesa Menu",
			description: "Open the M-Pesa menu on your phone",
			icon: faMobile,
		},
		{
			step: 2,
			title: "Select Lipa na M-Pesa",
			description: "Choose the Lipa na M-Pesa option",
			icon: faCreditCard,
		},
		{
			step: 3,
			title: "Choose Paybill",
			description: "Select Paybill as your payment method",
			icon: faMoneyBillWave,
		},
		{
			step: 4,
			title: "Enter Business Number",
			description: "Enter Business Number: 4160265",
			icon: faPhone,
		},
		{
			step: 5,
			title: "Enter Account Number",
			description: "Enter your phone number (used during registration)",
			icon: faPhone,
		},
		{
			step: 6,
			title: "Enter Amount",
			description: "Enter the amount for your selected tier",
			icon: faMoneyBillWave,
		},
		{
			step: 7,
			title: "Confirm Payment",
			description: "Enter your M-Pesa PIN and confirm",
			icon: faLock,
		},
	];

	const stkPushSteps = [
		{
			step: 1,
			title: "Request STK Push",
			description: "Click 'Pay with STK Push' button on the payment page",
			icon: faMobile,
		},
		{
			step: 2,
			title: "Check Your Phone",
			description: "You'll receive an M-Pesa popup notification",
			icon: faPhone,
		},
		{
			step: 3,
			title: "Enter PIN",
			description: "Enter your M-Pesa PIN on the popup",
			icon: faLock,
		},
		{
			step: 4,
			title: "Confirm Payment",
			description: "Tap 'OK' to complete the payment",
			icon: faCheckCircle,
		},
	];

	return (
		<section className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-white">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-6 sm:mb-8">
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
						<FontAwesomeIcon
							icon={faCreditCard}
							className="text-sm sm:text-base text-white"
						/>
					</div>
					<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
						How to Pay via M-Pesa Paybill
					</h2>
					<p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
						Follow these simple steps to complete your payment securely through
						M-Pesa
					</p>
				</div>

				{/* Payment Method Toggle */}
				<div className="flex justify-center mb-6 sm:mb-8">
					<div className="bg-gray-200 rounded-lg p-1 flex">
						<button
							onClick={() => setSelectedMethod("manual")}
							className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
								selectedMethod === "manual"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Manual Paybill
						</button>
						<button
							onClick={() => setSelectedMethod("stk")}
							className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
								selectedMethod === "stk"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							STK Push
						</button>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
					{/* Payment Steps */}
					<div className="space-y-3 sm:space-y-4">
						{selectedMethod === "manual"
							? paymentSteps.map((item) => (
									<div
										key={item.step}
										className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
									>
										<div className="flex items-center space-x-3">
											<div className="flex-shrink-0">
												<div className="bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold w-8 h-8 sm:w-9 sm:h-9">
													<span className="text-xs sm:text-sm">
														{item.step}
													</span>
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
													{item.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>
									</div>
							  ))
							: stkPushSteps.map((item) => (
									<div
										key={item.step}
										className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
									>
										<div className="flex items-center space-x-3">
											<div className="flex-shrink-0">
												<div className="bg-blue-500 text-white rounded-full flex items-center justify-center font-bold w-8 h-8 sm:w-9 sm:h-9">
													<span className="text-xs sm:text-sm">
														{item.step}
													</span>
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
													{item.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>
									</div>
							  ))}
					</div>

					{/* Visual Guide */}
					<div className="text-center">
						<img
							src="https://res.cloudinary.com/dvczs0agl/image/upload/w_1200,q_85,f_auto,fl_lossy/v1757574384/HOW_TO_PAY-01_wkqw5e.png"
							alt="How to Pay Guide - Step by step payment process for Carbon Cube Kenya sellers"
							className="w-full h-auto object-contain"
						/>
					</div>
				</div>

				{/* Bottom Section - Compact Grid */}
				<div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					{/* Paybill Number */}
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 sm:p-5 text-center">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
							<FontAwesomeIcon
								icon={faPhone}
								className="text-sm sm:text-base text-white"
							/>
						</div>
						<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">
							Paybill Number
						</h3>
						<div className="text-xl sm:text-2xl font-bold text-yellow-600 font-mono mb-1">
							4160265
						</div>
						<p className="text-xs sm:text-sm text-gray-600">
							Use when prompted for Business Number
						</p>
					</div>

					{/* Payment Confirmation */}
					<div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 sm:p-5 text-center">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
							<FontAwesomeIcon
								icon={faCheckCircle}
								className="text-sm sm:text-base text-white"
							/>
						</div>
						<h3 className="text-sm sm:text-base font-bold text-green-800 mb-1 sm:mb-2">
							Instant Activation
						</h3>
						<p className="text-xs sm:text-sm text-green-700 leading-relaxed">
							Account upgraded immediately after payment confirmation
						</p>
					</div>

					{/* Contact Information */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 sm:p-5 text-center">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
							<FontAwesomeIcon
								icon={faPhone}
								className="text-sm sm:text-base text-white"
							/>
						</div>
						<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">
							Need Help?
						</h3>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-gray-600">
								<a
									href="mailto:info@carboncube-ke.com"
									className="text-yellow-600 hover:text-yellow-700 transition-colors font-semibold"
									target="_blank"
									rel="noopener noreferrer"
								>
									info@carboncube-ke.com
								</a>
							</p>
							<p className="text-xs sm:text-sm text-gray-600">
								<a
									href="tel:+254712990524"
									className="text-yellow-600 hover:text-yellow-700 transition-colors font-semibold"
								>
									+254 712 990524
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MpesaPaymentGuide;
