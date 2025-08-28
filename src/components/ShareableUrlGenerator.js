import React, { useState, useEffect } from "react";
import {
	FaFacebook,
	FaWhatsapp,
	FaTelegram,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
	FaEnvelope,
	FaSms,
	FaYoutube,
	FaTiktok,
} from "react-icons/fa";
import sourceTrackingService from "../utils/sourceTracking";

const ShareableUrlGenerator = ({ baseUrl, title, description }) => {
	const [selectedSource, setSelectedSource] = useState("facebook");
	const [generatedUrl, setGeneratedUrl] = useState("");
	const [showToast, setShowToast] = useState(false);

	// Auto-hide toast after 3 seconds
	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				setShowToast(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const sources = [
		{ value: "facebook", label: "Facebook", icon: FaFacebook },
		{ value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
		{ value: "telegram", label: "Telegram", icon: FaTelegram },
		{ value: "twitter", label: "Twitter", icon: FaTwitter },
		{ value: "instagram", label: "Instagram", icon: FaInstagram },
		{ value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
		{ value: "youtube", label: "YouTube", icon: FaYoutube },
		{ value: "tiktok", label: "TikTok", icon: FaTiktok },
		{ value: "email", label: "Email", icon: FaEnvelope },
		{ value: "sms", label: "SMS", icon: FaSms },
	];

	const generateUrl = () => {
		const url = sourceTrackingService.createShareableUrl(
			baseUrl,
			selectedSource
		);
		setGeneratedUrl(url);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedUrl);
			setShowToast(true);
		} catch (err) {
			console.error("Failed to copy URL:", err);
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = generatedUrl;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setShowToast(true);
		}
	};

	const generateSocialShareUrls = () => {
		return sourceTrackingService.generateSocialShareUrls(
			baseUrl,
			title,
			description
		);
	};

	const openSocialShare = (platform) => {
		const shareUrls = generateSocialShareUrls();
		const url = shareUrls[platform];
		if (url) {
			window.open(url, "_blank", "width=600,height=400");
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">
				Generate Shareable URLs
			</h3>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Select Source:
				</label>
				<div className="flex flex-col sm:flex-row gap-3">
					<select
						value={selectedSource}
						onChange={(e) => setSelectedSource(e.target.value)}
						className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
					>
						{sources.map((source) => {
							const IconComponent = source.icon;
							return (
								<option key={source.value} value={source.value}>
									{source.label}
								</option>
							);
						})}
					</select>
					<button
						onClick={generateUrl}
						className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium whitespace-nowrap"
					>
						Generate URL
					</button>
				</div>
			</div>

			{generatedUrl && (
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Generated URL:
					</label>
					<div className="flex flex-col sm:flex-row gap-2">
						<input
							type="text"
							value={generatedUrl}
							readOnly
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
						/>
						<button
							onClick={copyToClipboard}
							className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium text-sm whitespace-nowrap"
						>
							Copy URL
						</button>
					</div>
				</div>
			)}

			<div className="border-t pt-4">
				<h4 className="text-md font-semibold mb-3 text-gray-800">
					Quick Share Buttons
				</h4>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
					{sources.slice(0, 8).map((source) => {
						const IconComponent = source.icon;
						return (
							<button
								key={source.value}
								onClick={() => openSocialShare(source.value)}
								className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 py-3 px-2 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
							>
								<IconComponent className="w-5 h-5 text-gray-600" />
								<span className="text-xs font-medium text-gray-700">
									{source.label}
								</span>
							</button>
						);
					})}
				</div>
			</div>
			
			{/* Toast Notification */}
			{showToast && (
				<div className="fixed top-4 right-4 z-50">
					<div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
						<div className="flex-shrink-0">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
						</div>
						<div>
							<p className="font-medium">Success!</p>
							<p className="text-sm opacity-90">URL copied to clipboard!</p>
						</div>
						<button
							onClick={() => setShowToast(false)}
							className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShareableUrlGenerator;
