import React from "react";

const MpesaPaymentGuide = () => {
	return (
		<section className="py-6 sm:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
					{/* Header */}
					<div className="bg-gray-800 px-4 sm:px-6 py-4 border-b border-gray-700">
						<h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-yellow-400 mr-3 flex-shrink-0"
							>
								<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
							</svg>
							How to Pay via M-Pesa Paybill
						</h3>
					</div>

					{/* Body */}
					<div className="px-4 sm:px-6 py-4 sm:py-6">
						{/* Paybill Number - Prominently Displayed */}
						<div className="text-center mb-6">
							<div className="bg-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600">
								<p className="text-gray-300 text-sm sm:text-base mb-2">
									Paybill Number
								</p>
								<div className="text-4xl sm:text-5xl font-bold text-yellow-400 font-mono">
									4160265
								</div>
							</div>
						</div>

						{/* Payment Steps */}
						<ol className="space-y-3 sm:space-y-4 mb-6">
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									1
								</span>
								<div>
									<strong className="text-white">Go to M-Pesa:</strong>{" "}
									<span className="text-gray-300">
										Open the <em>M-Pesa menu</em> on your phone and select{" "}
										<strong>Lipa na M-Pesa</strong>.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									2
								</span>
								<div>
									<strong className="text-white">Select Paybill:</strong>{" "}
									<span className="text-gray-300">
										Choose <strong>Paybill</strong> as the payment option.
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									3
								</span>
								<div>
									<strong className="text-white">Enter Business Number:</strong>{" "}
									<span className="text-gray-300">Type in </span>
									<code className="bg-gray-700 text-yellow-400 px-2 py-1 rounded text-sm font-mono">
										4160265
									</code>
									<span className="text-gray-300">.</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									4
								</span>
								<div>
									<strong className="text-white">Enter Account Number:</strong>{" "}
									<span className="text-gray-300">
										Use your <strong>Phone Number</strong> (same as used during
										registration).
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									5
								</span>
								<div>
									<strong className="text-white">Enter Amount:</strong>{" "}
									<span className="text-gray-300">
										Input the amount for your selected tier and duration
										suitable for you. (e.g., KES 500, 1000, etc.).
									</span>
								</div>
							</li>
							<li className="flex items-start">
								<span className="bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
									6
								</span>
								<div>
									<strong className="text-white">Enter M-Pesa PIN:</strong>{" "}
									<span className="text-gray-300">
										Confirm and complete the payment with your PIN.
									</span>
								</div>
							</li>
						</ol>

						{/* Activation Notice */}
						<div className="bg-green-600 border border-green-500 rounded-lg p-4 mb-4">
							<div className="flex items-center">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="text-white mr-3 flex-shrink-0"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
								<p className="text-white text-sm sm:text-base">
									Once payment is received, your seller account will be{" "}
									<strong className="text-yellow-200">
										automatically activated
									</strong>
									.
								</p>
							</div>
						</div>

						{/* Contact Information */}
						<div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
							<div className="flex items-center">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="text-yellow-400 mr-3 flex-shrink-0"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
								</svg>
								<div className="text-gray-300 text-sm sm:text-base">
									Need help? Email{" "}
									<a
										href="mailto:info@carboncube-ke.com"
										className="text-yellow-400 hover:text-yellow-300 transition-colors"
										target="_blank"
										rel="noopener noreferrer"
									>
										info@carboncube-ke.com
									</a>{" "}
									or call{" "}
									<a
										href="tel:+254712990524"
										className="text-yellow-400 hover:text-yellow-300 transition-colors"
									>
										+254 712 990524
									</a>
									.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MpesaPaymentGuide;
