import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Gear, Truck, GeoAlt } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/SellerNotifications.css';  // Custom CSS file
import { createConsumer } from "@rails/actioncable";

const SellerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        const fetchSellerId = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/identify`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json', // Ensure Content-Type is set if needed
                        },
                    });
        
                        // console.log('Response Status:', response.status);
    // console.log('Response Headers:', response.headers);
        
                    if (!response.ok) {
                        throw new Error(`Network response was not ok. Status: ${response.status}`);
                    }
        
                    const data = await response.json();
                    // console.log('Fetched Seller ID Data:', data);
                    setSellerId(data.seller_id);
                } catch (error) {
                    console.error('Error fetching seller ID:', error);
                    setError('Error fetching seller ID');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No token found');
                setLoading(false);
            }
        };
        
    
        fetchSellerId();
    }, []);
    

    useEffect(() => {
        if (sellerId) {
            const consumer = createConsumer(`ws://localhost:3000/cable`);
            const subscription = consumer.subscriptions.create(
                { channel: 'NotificationsChannel', seller_id: sellerId },
                {
                    received: (data) => {
                        setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);
                    },
                }
            );

            return () => subscription.unsubscribe();
        }
    }, [sellerId]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/notifications`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                setError('Failed to fetch notifications');
            }
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing':
                return 'Processing';
            case 'Dispatched':
                return 'Dispatched';
            case 'On-Transit':
                return 'On-Transit';
            case 'Delivered':
                return 'Delivered';
            default:
                return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing':
                return <Gear className="status-icon processing" />;
            case 'Dispatched':
                return <Truck className="status-icon dispatched" />;
            case 'On-Transit':
                return <FontAwesomeIcon icon={faTruckFast} className="status-icon on-transit" />;
            case 'Delivered':
                return <GeoAlt className="status-icon delivered" />;
            default:
                return null;
        }
    };

    const getStatusMessage = (status, id) => {
        switch (status) {
            case 'Processing':
                return `Order #${id} is under processing and ready to be sent out for delivery.`;
            case 'Dispatched':
                return `Order #${id} has been dispatched to the collection centre (Warehouse).`;
            case 'On-Transit':
                return `Order #${id} is on transit to the delivery address.`;
            case 'Delivered':
                return `Order #${id} has been delivered to the provided address.`;
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="notifications-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Container fluid className="p-0" style={{ flex: 1 }}>
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 className="mb-2">Notifications</h2>
                            <Card className="notification-card-wrapper" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                                <Card.Header className="big-card-header justify-content-center ">Notifications</Card.Header>
                                <Card.Body className="big-card-body" style={{ overflowY: 'auto', flex: 1 }}>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <Card key={notification.order_id} className="mb-3 notification-card">
                                                <Card.Body>
                                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                                        <span className={`order-id ${getStatusColor(notification.status)}`}>
                                                            Order #{notification.order_id}
                                                        </span>
                                                        <Badge
                                                            bg={notification.status === 'Processing' ? 'warning' :
                                                                notification.status === 'Dispatched' ? 'primary' :
                                                                notification.status === 'Delivered' ? 'success' :
                                                                notification.status === 'On-Transit' ? 'info' : 'success'}
                                                        >
                                                            {notification.status}
                                                        </Badge>
                                                    </Card.Title>
                                                    <Card.Text className='card-text'>
                                                        {getStatusMessage(notification.status, notification.order_id)}
                                                    </Card.Text>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">
                                                            <em>{new Date(notification.created_at).toLocaleString()}</em>
                                                        </span>
                                                        {getStatusIcon(notification.status)}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    ) : (
                                        <p>No notifications available</p>
                                    )}
                                </Card.Body>
                                <Card.Footer className="big-card-footer mb-1"></Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default SellerNotifications;
