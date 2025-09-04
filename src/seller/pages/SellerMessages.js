import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";

const SellerMessages = () => {
	return (
		<Messages
			userType="seller"
			apiBaseUrl="/seller/conversations"
			navbarComponent={
				<Navbar mode="seller" showSearch={true} showCategories={true} />
			}
			sidebarComponent={<Sidebar />}
			title="Messages"
			showProductContext={true}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default SellerMessages;
