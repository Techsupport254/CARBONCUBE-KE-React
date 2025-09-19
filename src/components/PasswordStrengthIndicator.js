import React from "react";

const PasswordStrengthIndicator = ({ password, email, username }) => {
	const calculateStrength = (password) => {
		if (!password) return { score: 0, label: "", color: "" };

		let score = 0;
		const checks = {
			length: password.length >= 8,
			hasLowercase: /[a-z]/.test(password),
			hasUppercase: /[A-Z]/.test(password),
			hasNumbers: /\d/.test(password),
			hasSymbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			notCommon: !isCommonPassword(password),
			notSequential: !isSequential(password),
			notRepeated: !hasRepeatedChars(password),
			notContainsPersonal: !containsPersonalInfo(password, email, username),
		};

		// Calculate score based on checks
		Object.values(checks).forEach((check) => {
			if (check) score += 1;
		});

		// Additional points for length
		if (password.length >= 12) score += 1;
		if (password.length >= 16) score += 1;

		// Determine strength level
		if (score <= 3)
			return {
				score,
				label: "Weak",
				color: "text-red-500",
				bgColor: "bg-red-500",
			};
		if (score <= 5)
			return {
				score,
				label: "Fair",
				color: "text-orange-500",
				bgColor: "bg-orange-500",
			};
		if (score <= 7)
			return {
				score,
				label: "Good",
				color: "text-yellow-500",
				bgColor: "bg-yellow-500",
			};
		return {
			score,
			label: "Strong",
			color: "text-green-500",
			bgColor: "bg-green-500",
		};
	};

	const isCommonPassword = (password) => {
		const commonPasswords = [
			"password",
			"123456",
			"123456789",
			"qwerty",
			"abc123",
			"password123",
			"admin",
			"12345678",
			"letmein",
			"welcome",
			"monkey",
			"dragon",
			"master",
			"hello",
			"login",
			"passw0rd",
			"123123",
			"welcome123",
			"1234567",
			"12345",
			"1234",
			"111111",
			"000000",
			"1234567890",
		];
		return commonPasswords.includes(password.toLowerCase());
	};

	const isSequential = (password) => {
		const sequentialPatterns = [
			"0123456789",
			"abcdefghijklmnopqrstuvwxyz",
			"qwertyuiopasdfghjklzxcvbnm",
		];
		return sequentialPatterns.some((pattern) =>
			password.toLowerCase().includes(pattern.toLowerCase())
		);
	};

	const hasRepeatedChars = (password) => {
		return /(.)\1{3,}/.test(password);
	};

	const containsPersonalInfo = (password, email, username) => {
		if (!password) return false;
		const passwordLower = password.toLowerCase();

		if (email) {
			const emailPrefix = email.split("@")[0].toLowerCase();
			if (passwordLower.includes(emailPrefix)) return true;
		}

		if (username && passwordLower.includes(username.toLowerCase())) {
			return true;
		}

		return false;
	};

	const getStrengthChecks = (password) => {
		return [
			{ label: "At least 8 characters", passed: password.length >= 8 },
			{ label: "Contains lowercase letter", passed: /[a-z]/.test(password) },
			{ label: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
			{ label: "Contains number", passed: /\d/.test(password) },
			{
				label: "Contains special character",
				passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			},
			{ label: "Not a common password", passed: !isCommonPassword(password) },
			{ label: "No sequential characters", passed: !isSequential(password) },
			{ label: "No repeated characters", passed: !hasRepeatedChars(password) },
			{
				label: "Doesn't contain personal info",
				passed: !containsPersonalInfo(password, email, username),
			},
		];
	};

	const strength = calculateStrength(password);
	const checks = getStrengthChecks(password);

	if (!password) return null;

	return (
		<div className="mt-2 space-y-2">
			{/* Strength Bar */}
			<div className="flex items-center space-x-2">
				<div className="flex-1 bg-gray-200 rounded-full h-2">
					<div
						className={`h-2 rounded-full transition-all duration-300 ${strength.bgColor}`}
						style={{ width: `${(strength.score / 9) * 100}%` }}
					/>
				</div>
				<span className={`text-sm font-medium ${strength.color}`}>
					{strength.label}
				</span>
			</div>

			{/* Detailed Checks */}
			<div className="text-xs space-y-1">
				{checks.map((check, index) => (
					<div key={index} className="flex items-center space-x-2">
						<span className={check.passed ? "text-green-500" : "text-gray-400"}>
							{check.passed ? "✓" : "○"}
						</span>
						<span className={check.passed ? "text-green-600" : "text-gray-500"}>
							{check.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default PasswordStrengthIndicator;
