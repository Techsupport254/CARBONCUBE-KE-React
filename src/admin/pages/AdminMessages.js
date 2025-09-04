import React from "react";
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminMessages = () => {
	return (
		<Messages
			userType="admin"
			apiBaseUrl="/admin/conversations"
			navbarComponent={
				<Navbar mode="admin" showSearch={true} showCategories={true} />
			}
			sidebarComponent={<Sidebar />}
			title="Messages"
			showProductContext={false}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};

export default AdminMessages;
