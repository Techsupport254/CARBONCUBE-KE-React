import React from "react";
import { Card } from "react-bootstrap";

const MpesaPaymentGuide = () => {
	return (
		<Card className="max-w-7xl mx-auto mt-5 shadow-sm border-success bg-dark custom-card">
			<Card.Header className="text-white bg-dark">
				<h5 className="mb-0 text-warning d-flex align-items-center">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="me-2"
					>
						<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
					</svg>
					How to Pay via M-Pesa Paybill
				</h5>
			</Card.Header>
			<Card.Body>
				<ol className="ps-3" style={{ lineHeight: "1.7" }}>
					<li>
						<strong>Go to M-Pesa:</strong> Open the <em>M-Pesa menu</em> on your
						phone and select <strong>Lipa na M-Pesa</strong>.
					</li>
					<li>
						<strong>Select Paybill:</strong> Choose <strong>Paybill</strong> as
						the payment option.
					</li>
					<li>
						<strong>Enter Business Number:</strong> Type in{" "}
						<strong>
							<code className="text-success">4160265</code>
						</strong>
						.
					</li>
					<li>
						<strong>Enter Account Number:</strong> Use your{" "}
						<strong>Phone Number</strong> (same as used during registration).
					</li>
					<li>
						<strong>Enter Amount:</strong> Input the amount for your selected
						tier and duration suitable for you. (e.g., KES 500, 1000, etc.).
					</li>
					<li>
						<strong>Enter M-Pesa PIN:</strong> Confirm and complete the payment
						with your PIN.
					</li>
				</ol>

				<p className="mt-3 text-success d-flex align-items-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="me-2"
					>
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
					</svg>
					Once payment is received, your seller account will be{" "}
					<strong>automatically activated</strong>.
				</p>

				<p className="text-dark d-flex align-items-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="me-2"
					>
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
					</svg>
					Need help? Email{" "}
					<a
						href="mailto:info@carboncube-ke.com"
						className="text-success"
						target="_blank"
						rel="noopener noreferrer"
					>
						info@carboncube-ke.com
					</a>{" "}
					or call{" "}
					<a href="tel:+254712990524" className="text-success">
						+254 712 990524
					</a>
					.
				</p>
			</Card.Body>
		</Card>
	);
};

export default MpesaPaymentGuide;
