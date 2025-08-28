import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/Orders.css';
// import consumer from "../cable"; // Import ActionCable consumer

const Orders = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const buyerId = sessionStorage.getItem('buyerId');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/orders?buyer_id=${buyerId}&search_query=${searchQuery}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // // Subscribe to the orders channel for real-time updates
        // const subscription = consumer.subscriptions.create("OrdersChannel", {
        //     received: (data) => {
        //         const updatedOrder = data.order;
        //         setOrders(prevOrders =>
        //             prevOrders.map(order =>
        //                 order.id === updatedOrder.id ? updatedOrder : order
        //             )
        //         );
        //     }
        // });

        // return () => {
        //     subscription.unsubscribe();
        // };
    }, [searchQuery, buyerId]);

    const handleRowClick = async (orderId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/orders/${orderId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('Fetched order details:', data);
            setSelectedOrder(data);
            setShowModal(true);
        } catch (error) {
            // console.error('Error fetching order details:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
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
            <div className="orders-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} lg={9} className="p-0">
                            <Card className="section">
                                <Card.Header className="text-center orders-header p-1 p-lg-2">
                                    <Container fluid>
                                        <Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
                                            <Col xs="auto" className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3 ps-3">
                                                <h4 className="mb-0 align-self-center">Orders</h4>
                                            </Col>
                                            <Col xs="auto" className="d-flex align-items-center">
                                                <div className="search-container d-flex align-items-center">
                                                    <Form>
                                                        <Form.Group controlId="searchPhoneNumberOrID">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Search (Order ID)"
                                                                className="form-control"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Header>

                                <Card.Body className="p-0 table-container">
                                    <div className="table-responsive orders-table-container">
                                        <Table hover className="orders-table text-center">
                                        <thead className="table-header">
                                            <tr>
                                            <th>Order ID</th>
                                            <th>Ads</th>
                                            <th>Quantity</th>
                                            <th>Total<em className="ad-price-label" style={{ fontSize : '14px' }}>(Kshs:) </em></th>
                                            <th>Date Ordered</th>
                                            <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length > 0 ? (
                                            orders.map((order) => (
                                                <tr
                                                key={order.id}
                                                onClick={() => handleRowClick(order.id)}
                                                style={{ cursor: 'pointer' }}
                                                >
                                                <td>{order.id}</td>
                                                <td>
                                                    {order.order_items
                                                    .slice(0, 3) // Limit to the first 3 ads
                                                    .map((item, index, array) => {
                                                        const adName = item.ad_name || 'Unknown';
                                                        const truncatedName = adName.split(' ').slice(0, 3).join(' ');
                                                        return `${truncatedName}${index < array.length - 1 ? ',' : ''}`;
                                                    })
                                                    .join(' ')}
                                                    {order.order_items.length > 3 && ', ...'}
                                                </td>
                                                <td>{order.order_items.map(item => item.quantity || 0).reduce((a, b) => a + b, 0)}</td>
                                                <td className="price-container text-success">
                                                    <strong>
                                                    {order.total_amount
                                                        ? parseFloat(order.total_amount).toFixed(2).split('.').map((part, index) => (
                                                        <React.Fragment key={index}>
                                                            {index === 0 ? (
                                                            <span className="price-integer">
                                                                {parseInt(part, 10).toLocaleString()}
                                                            </span>
                                                            ) : (
                                                            <>
                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                <span className="price-decimal">{part}</span>
                                                            </>
                                                            )}
                                                        </React.Fragment>
                                                        )) : 'N/A'}
                                                    </strong>
                                                </td>
                                                <td>{order.order_date || 'N/A'}</td>
                                                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                                                    <Form.Control
                                                        className="form-select-admin text-center" // Custom class for removing arrow
                                                        as="select"
                                                        value={order.status}
                                                        id="button"
                                                        disabled
                                                        style={{
                                                            verticalAlign: 'middle',
                                                            display: 'inline-block',
                                                            width: '60%',
                                                            height: '40px', // Adjust the height to your preference
                                                            backgroundColor: 
                                                                order.status === 'Cancelled' ? '#FF0000' :  // Red
                                                                order.status === 'Dispatched' ? '#007BFF' : // Blue
                                                                order.status === 'In-Transit' ? '#80CED7' : // Light Blue
                                                                order.status === 'Returned' ? '#6C757D' :  // Grey
                                                                order.status === 'Processing' ? '#FFC107' : // Yellow
                                                                order.status === 'Delivered' ? '#008000' : '', // Green
                                                            color: ['Delivered', 'Returned', 'Dispatched', 'Cancelled'].includes(order.status) 
                                                                ? 'white' : 'black', // White text for specific statuses
                                                            
                                                        }}
                                                    >
                                                        <option value={order.status}>{order.status}</option>
                                                    </Form.Control>
                                                </td>
                                                </tr>
                                            ))
                                            ) : (
                                            <tr>
                                                <td colSpan="7">No data available</td>
                                            </tr>
                                            )}
                                        </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                </Card.Footer>
                            </Card>

                            <Modal centered show={showModal} onHide={handleCloseModal} size="xl">
                                <Modal.Header className="justify-content-center p-1 p-lg-2">
                                    <Modal.Title>Order Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="px-1 px-lg-3 py-1 py-lg-3">
                                    {selectedOrder ? (
                                        <>
                                            <Row>
                                                <Col xs={6} md={6} lg={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='text-center'>Order ID</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.id}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={6} md={6} lg={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='text-center'>Date Ordered</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.order_date || 'N/A'}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Card className="mb-2 custom-card-seller">
                                                        <Card.Header as="h6" className="text-center">Ads</Card.Header>
                                                        <Card.Body>
                                                            {selectedOrder?.order_items?.length > 0 ? (
                                                            <Table striped bordered hover className="transparent-table transparent-table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Ad Name</th>
                                                                        <th>Price</th>
                                                                        <th>Quantity</th>
                                                                        <th>Total Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {selectedOrder.order_items.map(item => (
                                                                        <tr key={item.id}>
                                                                            <td>{item.ad_name || 'Unknown Ad'}</td>
                                                                            <td className='text-success'>
                                                                                {item.price ? parseFloat(item.price).toFixed(2).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                )) : 'N/A'}
                                                                            </td>
                                                                            <td>{item.quantity}</td>
                                                                            <td className='text-success'>
                                                                                {(item.price && item.quantity) ? (
                                                                                    ((item.price * item.quantity).toFixed(2).split('.').map((part, index) => (
                                                                                        <React.Fragment key={index}>
                                                                                            {index === 0 ? (
                                                                                                <span className="price-integer">
                                                                                                    {parseInt(part, 10).toLocaleString()}
                                                                                                </span>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <span style={{ fontSize: '16px' }}>.</span>
                                                                                                    <span className="price-decimal">{part}</span>
                                                                                                </>
                                                                                            )}
                                                                                        </React.Fragment>
                                                                                    )))
                                                                                ) : 'N/A'}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    {/* Total Row
                                                                    <tr>
                                                                        <td colSpan="3" className="text-right">
                                                                            <strong>Total Price for the Order:</strong>
                                                                        </td>
                                                                        <td>
                                                                            <strong>
                                                                                {selectedOrder.order_items.reduce((acc, item) => {
                                                                                    const itemTotalPrice = (item.price || 0) * (item.quantity || 0);
                                                                                    return acc + itemTotalPrice;
                                                                                }, 0).toFixed(2).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </strong>
                                                                        </td>
                                                                    </tr> */}
                                                                    {/* Processing Fee Row */}
                                                                    <tr>
                                                                        <td colSpan="3" className="text-right">
                                                                            <strong>Processing Fee:</strong>
                                                                        </td>
                                                                        <td className='text-success'>
                                                                            <strong>
                                                                                {selectedOrder.processing_fee ? parseFloat(selectedOrder.processing_fee).toFixed(2).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                )) : 'N/A'}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                    {/* Delivery Fee Row */}
                                                                    <tr>
                                                                        <td colSpan="3" className="text-right">
                                                                            <strong>Delivery Fee:</strong>
                                                                        </td>
                                                                        <td className='text-success'>
                                                                            <strong>
                                                                                {selectedOrder.delivery_fee ? parseFloat(selectedOrder.delivery_fee).toFixed(2).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                )) : 'N/A'}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                    {/* Grand Total Row */}
                                                                    <tr>
                                                                        <td colSpan="3" className="text-right">
                                                                            <strong>Grand Total:</strong>
                                                                        </td>
                                                                        <td className='text-success'>
                                                                            <strong>
                                                                                {(
                                                                                    selectedOrder.order_items.reduce((acc, item) => {
                                                                                        const itemTotalPrice = (item.price || 0) * (item.quantity || 0);
                                                                                        return acc + itemTotalPrice;
                                                                                    }, 0) + 
                                                                                    Number(selectedOrder.processing_fee || 0) + 
                                                                                    Number(selectedOrder.delivery_fee || 0)
                                                                                ).toFixed(2).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                            ) : (
                                                            <p>No ads available</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </>
                                    ) : (
                                        <p>No order details available.</p>
                                    )}
                                </Modal.Body>

                                <Modal.Footer className="p-1 p-lg-2">
                                    <Button variant="danger" id="button" onClick={handleCloseModal} >
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Orders;