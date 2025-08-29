import React from "react";
import Spinner from "react-spinkit";
import Navbar from "../../components/Navbar";

const LoadingSpinner = () => {
	return (
		<>
			<Navbar mode="sales" showSearch={false} showCategories={false} />
			<div
				className="d-flex justify-content-center align-items-center"
				style={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
					fontFamily: '"Fira Sans Extra Condensed", sans-serif',
				}}
			>
				<Spinner
					variant="warning"
					name="cube-grid"
					style={{ width: 100, height: 100 }}
				/>
			</div>
		</>
	);
};

export default LoadingSpinner;
