import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";

const AdminMessages = () => {
	return (
		<Messages
			userType="admin"
			apiBaseUrl="/admin/conversations"
			navbarComponent={
				<Navbar mode="admin" showSearch={true} showCategories={true} />
			}
			title="Messages"
			showProductContext={false}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default AdminMessages;
