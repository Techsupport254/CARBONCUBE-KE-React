import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table } from 'react-bootstrap';
import { Trash, Pencil, PlusCircle } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
// import { Doughnut } from 'react-chartjs-2';
import Spinner from "react-spinkit";
import '../css/PromotionsDiscount.css';  // Custom CSS

const PromotionsDiscount = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePromotion, setActivePromotion] = useState({
        id: null,
        title: '',
        description: '',
        discount_percentage: 0,
        coupon_code: '',
        start_date: '',
        end_date: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/promotions`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPromotions(data);
            } else {
                // console.error('Fetched data is not an array:', data);
                setPromotions([]);
            }
        } catch (error) {
            // console.error('Failed to fetch promotions:', error);
            setPromotions([]);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const url = activePromotion.id 
            ? `${process.env.REACT_APP_BACKEND_URL}/admin/promotions/${activePromotion.id}` 
            : `${process.env.REACT_APP_BACKEND_URL}/admin/promotions`;
        const method = activePromotion.id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activePromotion),
        });
        if (response.ok) {
            setShowModal(false);
            fetchPromotions();
        } else {
            // console.error('Failed to save promotion');
        }
    };

    const handleShowModal = (promotion = null) => {
        if (promotion) {
            setActivePromotion(promotion);
        } else {
            setActivePromotion({
                id: null,
                title: '',
                description: '',
                discount_percentage: 0,
                coupon_code: '',
                start_date: '',
                end_date: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivePromotion({ ...activePromotion, [name]: value });
    };

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/promotions/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchPromotions();
        } else {
            // console.error('Failed to delete promotion');
        }
    };

    // const pieData = (percentage) => ({
    //     datasets: [{
    //         data: [percentage, 100 - percentage],
    //         backgroundColor: ['#ffc107', '#f8f9fa'],
    //     }],
    //     labels: ['Completed', 'Remaining'],
    // });

    // const chartOptions = {
    //     cutout: '80%',
    //     plugins: {
    //         legend: {
    //             display: false,
    //         },
    //     },
    // };

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    return (
        <>
            <TopNavbar />
            <div className="promotions-discount-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={10} lg={9} className="p-1 p-lg-2">
                            <Card className='section mt-2'>
                                <Card.Header className="card-header justify-content-center p-0 p-lg-1">
                                    <h4 className="mb-0 p-1 p-lg-2 align-self-center">Active Promotions</h4>
                                </Card.Header>
                                <Card.Body className="table-container">
                                    <div className="table-responsive">
                                        <Table className="text-center orders-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Discount %</th>
                                                    <th>Coupon Code</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {promotions.map((promotion) => (
                                                    <tr key={promotion.id}>
                                                        <td>{promotion.id}</td>
                                                        <td>{promotion.title}</td>
                                                        <td>{promotion.description}</td>
                                                        <td>{promotion.discount_percentage}%</td>
                                                        <td>{promotion.coupon_code}</td>
                                                        <td>{new Date(promotion.start_date).toLocaleDateString()}</td>
                                                        <td>{new Date(promotion.end_date).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button 
                                                                variant="warning" 
                                                                className="me-2"
                                                                id="button"
                                                                onClick={() => handleShowModal(promotion)}
                                                            >
                                                                <Pencil />
                                                            </Button>
                                                            <Button 
                                                                variant="danger"
                                                                id="button" 
                                                                onClick={() => handleDelete(promotion.id)}
                                                            >
                                                                <Trash /> 
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>                                           
                                </Card.Body>
                                <Card.Footer className="card-footer text-center p-1 p-lg-2">
                                    <Button variant="warning" id="button" onClick={handleShowModal}>
                                        <PlusCircle /> Create New Promotion
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                            {/* <Row>
                                <Col md={12} className="mb-4">
                                    <Card className="campaign-card">
                                        <Card.Header className="card-header justify-content-center">Campaign Performance</Card.Header>
                                        <Card.Body className="text-center">
                                        <Row>
                                        <Col md={6} className="mb-4">
                                                <div className="doughnut-chart-container">
                                                    <Doughnut data={pieData(40)} options={chartOptions} className="doughnut-chart" />
                                                </div>
                                                <p>Redemption Rate</p>
                                            </Col>

                                            <Col md={6} className="mb-4">
                                                <div className="doughnut-chart-container">
                                                    <Doughnut data={pieData(20)} options={chartOptions} className="doughnut-chart" />
                                                </div>
                                                <p>Sales Increase</p>
                                            </Col>
                                        </Row>
                                            
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                            </Row> */}
                </Container>
            </div>

            <Modal centered show={showModal} onHide={handleCloseModal}>
                <Modal.Header className="justify-content-center p-1 p-lg-2">
                    <Modal.Title>{activePromotion.id ? 'Edit Promotion' : 'Create New Promotion'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-1">
                    <Form> 
                        <Form.Group controlId="formTitle" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder="Enter title" 
                                value={activePromotion.title} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="description"
                                placeholder="Enter description" 
                                value={activePromotion.description} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDiscountPercentage" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>Discount Percentage</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="discount_percentage"
                                placeholder="Enter discount percentage" 
                                value={activePromotion.discount_percentage} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>Start Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="start_date"
                                value={activePromotion.start_date} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>End Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="end_date"
                                value={activePromotion.end_date} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCouponCode" className="text-start">
                            <Form.Label style={{ fontWeight: 'bold' }}>Coupon Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="coupon_code"
                                placeholder="Enter coupon code" 
                                value={activePromotion.coupon_code} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="text-center p-0 p-lg-1">
                    <Button variant="danger" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PromotionsDiscount;
