# Reusable Messages Component

A fully configurable messaging component that can be used by buyers, sellers, and admins with minimal setup.

## Props

| Prop                   | Type      | Default                | Description                                 |
| ---------------------- | --------- | ---------------------- | ------------------------------------------- |
| `userType`             | string    | 'buyer'                | User type: 'buyer', 'seller', 'admin'       |
| `apiBaseUrl`           | string    | '/buyer/conversations' | API endpoint for conversations              |
| `showSidebar`          | boolean   | true                   | Whether to show the sidebar                 |
| `sidebarComponent`     | ReactNode | null                   | Sidebar component to render                 |
| `navbarComponent`      | ReactNode | null                   | Navbar component to render                  |
| `title`                | string    | 'Messages'             | Title for the messages section              |
| `containerClassName`   | string    | ''                     | Additional CSS classes for container        |
| `onConversationSelect` | function  | null                   | Callback when conversation is selected      |
| `onMessageSend`        | function  | null                   | Callback when message is sent               |
| `showProductContext`   | boolean   | true                   | Whether to show product context in messages |
| `showOnlineStatus`     | boolean   | true                   | Whether to show online status               |
| `showSearch`           | boolean   | true                   | Whether to show search functionality        |
| `maxWidth`             | string    | 'max-w-7xl'            | Maximum width of the container              |

## Usage Examples

### Buyer Messages

```jsx
import Messages from "../../components/Messages";
import Navbar from "../../components/Navbar";
import Sidebar from "../components/Sidebar";

const BuyerMessages = () => {
	return (
		<Messages
			userType="buyer"
			apiBaseUrl="/buyer/conversations"
			navbarComponent={
				<Navbar mode="buyer" showSearch={true} showCategories={true} />
			}
			sidebarComponent={<Sidebar />}
			title="Messages"
			showProductContext={true}
			showOnlineStatus={true}
			showSearch={true}
		/>
	);
};
```

### Seller Messages

```jsx
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
```

### Admin Messages

```jsx
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
```

### Custom Configuration

```jsx
import Messages from "../../components/Messages";

const CustomMessages = () => {
	const handleConversationSelect = (conversation) => {
		console.log("Selected conversation:", conversation);
	};

	const handleMessageSend = (message, conversation) => {
		console.log("Message sent:", message, "to:", conversation);
	};

	return (
		<Messages
			userType="buyer"
			apiBaseUrl="/buyer/conversations"
			title="Customer Support"
			showProductContext={false}
			showOnlineStatus={false}
			showSearch={false}
			onConversationSelect={handleConversationSelect}
			onMessageSend={handleMessageSend}
			containerClassName="custom-messages"
			maxWidth="max-w-6xl"
		/>
	);
};
```

## Features

- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Messages update automatically
- **Search Functionality**: Filter conversations by participant name
- **Product Context**: Show product information in messages (configurable)
- **Online Status**: Display participant online status (configurable)
- **Mobile Navigation**: Back button for mobile devices
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error handling
- **Customizable**: Highly configurable through props

## API Requirements

The component expects the following API endpoints:

- `GET /{apiBaseUrl}` - List conversations
- `GET /{apiBaseUrl}/{conversationId}/messages` - Get messages for a conversation
- `POST /{apiBaseUrl}/{conversationId}/messages` - Send a message

### Expected Response Format

**Conversations List:**

```json
[
	{
		"id": 1,
		"buyer_id": 123,
		"seller_id": 456,
		"admin_id": null,
		"ad_id": 789,
		"created_at": "2024-01-01T00:00:00Z",
		"updated_at": "2024-01-01T00:00:00Z",
		"last_message": "Hello there!",
		"last_message_time": "2024-01-01T00:00:00Z",
		"buyer": { "id": 123, "fullname": "John Doe", "profile_picture": "..." },
		"seller": { "id": 456, "fullname": "Jane Smith", "profile_picture": "..." },
		"admin": null,
		"ad": {
			"id": 789,
			"title": "Product Name",
			"price": 100,
			"first_media_url": "..."
		}
	}
]
```

**Messages:**

```json
{
	"messages": [
		{
			"id": 1,
			"content": "Hello there!",
			"created_at": "2024-01-01T00:00:00Z",
			"sender_type": "Buyer",
			"sender_id": 123,
			"ad_id": 789,
			"ad": {
				"id": 789,
				"title": "Product Name",
				"price": 100,
				"first_media_url": "..."
			}
		}
	],
	"total_messages": 1
}
```
