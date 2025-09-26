import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const LocationSelector = ({
	formData,
	handleChange,
	errors,
	showCityInput = true,
	showLocationInput = true,
	optional = false,
	className = "",
}) => {
	const [counties, setCounties] = useState([]);
	const [subCounties, setSubCounties] = useState([]);
	const [loadingCounties, setLoadingCounties] = useState(false);
	const [loadingSubCounties, setLoadingSubCounties] = useState(false);
	const [localCountyId, setLocalCountyId] = useState(formData.county_id || "");

	// Sync local state with formData when it changes
	useEffect(() => {
		setLocalCountyId(formData.county_id || "");
	}, [formData.county_id]);

	// Fetch counties on component mount
	useEffect(() => {
		const fetchCounties = async () => {
			setLoadingCounties(true);
			try {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/counties`
				);
				if (response.ok) {
					const data = await response.json();
					setCounties(data);
				}
			} catch (error) {
				console.error("Error fetching counties:", error);
			} finally {
				setLoadingCounties(false);
			}
		};

		fetchCounties();
	}, []);

	// Fetch sub-counties when county changes
	useEffect(() => {
		const fetchSubCounties = async () => {
			if (localCountyId) {
				setLoadingSubCounties(true);
				try {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URL}/counties/${localCountyId}/sub_counties`
					);
					if (response.ok) {
						const data = await response.json();
						setSubCounties(data);
					}
				} catch (error) {
					console.error("Error fetching sub-counties:", error);
				} finally {
					setLoadingSubCounties(false);
				}
			} else {
				setSubCounties([]);
			}
		};

		fetchSubCounties();
	}, [localCountyId]);

	// Handle county change - reset sub-county when county changes
	const handleCountyChange = (e) => {
		setLocalCountyId(e.target.value);
		handleChange(e);
		// Reset sub-county when county changes
		handleChange({
			target: {
				name: "sub_county_id",
				value: "",
			},
		});
	};

	return (
		<div className={`space-y-4 ${className}`}>
			{/* County and Sub-County - Same Row */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* County Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						County {!optional && <span className="text-red-500">*</span>}
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FontAwesomeIcon
								icon={faMapMarkerAlt}
								className="h-4 w-4 text-gray-400"
							/>
						</div>
						<select
							name="county_id"
							className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
								errors.county_id
									? "border-red-500 focus:ring-red-400"
									: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
							} focus:outline-none`}
							value={localCountyId}
							onChange={handleCountyChange}
							disabled={loadingCounties}
						>
							<option value="">
								{loadingCounties ? "Loading counties..." : "Select County"}
							</option>
							{counties.map((county) => (
								<option key={county.id} value={county.id}>
									{county.name}
								</option>
							))}
						</select>
					</div>
					{errors.county_id && (
						<div className="text-red-500 text-xs mt-1">{errors.county_id}</div>
					)}
				</div>

				{/* Sub-County Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Sub-County {!optional && <span className="text-red-500">*</span>}
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FontAwesomeIcon
								icon={faMapMarkerAlt}
								className="h-4 w-4 text-gray-400"
							/>
						</div>
						<select
							name="sub_county_id"
							className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
								errors.sub_county_id
									? "border-red-500 focus:ring-red-400"
									: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
							} focus:outline-none`}
							value={formData.sub_county_id}
							onChange={handleChange}
							disabled={!localCountyId || loadingSubCounties}
						>
							<option value="">
								{!localCountyId
									? "Select County First"
									: loadingSubCounties
									? "Loading sub-counties..."
									: "Select Sub-County"}
							</option>
							{subCounties.map((subCounty) => (
								<option key={subCounty.id} value={subCounty.id}>
									{subCounty.name}
								</option>
							))}
						</select>
					</div>
					{errors.sub_county_id && (
						<div className="text-red-500 text-xs mt-1">
							{errors.sub_county_id}
						</div>
					)}
				</div>
			</div>

			{/* City and Zip Code - Same Row */}
			{showCityInput && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* City Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							City {!optional && <span className="text-red-500">*</span>}
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FontAwesomeIcon
									icon={faMapMarkerAlt}
									className="h-4 w-4 text-gray-400"
								/>
							</div>
							<input
								type="text"
								placeholder="Enter your city"
								name="city"
								className={`w-full pl-10 pr-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
									errors.city
										? "border-red-500 focus:ring-red-400"
										: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
								} focus:outline-none`}
								value={formData.city}
								onChange={handleChange}
							/>
						</div>
						{errors.city && (
							<div className="text-red-500 text-xs mt-1">{errors.city}</div>
						)}
					</div>

					{/* Zip Code Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Zip Code
						</label>
						<input
							type="text"
							placeholder="Enter zip code"
							name="zipcode"
							className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 text-sm ${
								errors.zipcode
									? "border-red-500 focus:ring-red-400"
									: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
							} focus:outline-none`}
							value={formData.zipcode}
							onChange={handleChange}
						/>
						{errors.zipcode && (
							<div className="text-red-500 text-xs mt-1">{errors.zipcode}</div>
						)}
					</div>
				</div>
			)}

			{/* Location/Address Input */}
			{showLocationInput && (
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Physical Address <span className="text-red-500">*</span>
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FontAwesomeIcon
								icon={faMapMarkerAlt}
								className="h-4 w-4 text-gray-400"
							/>
						</div>
						<input
							type="text"
							placeholder="Enter physical address"
							name="location"
							className={`w-full pl-10 pr-4 py-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
								errors.location
									? "border-red-500 focus:ring-red-400"
									: "border-gray-300 focus:ring-yellow-400 focus:border-transparent"
							} focus:outline-none`}
							value={formData.location}
							onChange={handleChange}
						/>
					</div>
					{errors.location && (
						<div className="text-red-500 text-xs mt-1">{errors.location}</div>
					)}
				</div>
			)}
		</div>
	);
};

export default LocationSelector;
