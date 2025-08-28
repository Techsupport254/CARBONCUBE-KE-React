import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Trash, Pencil, Plus } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/TiersManagement.css';

const TiersManagement = () => {
    const [tiers, setTiers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [newTier, setNewTier] = useState({
        name: '',
        ads_limit: 0,
        features: [{ feature_name: '' }],
        pricings: [{ duration_months: '', price: '' }],
    });

    const fetchTiers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/tiers`, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch tiers');
            }
            const data = await response.json();
            setTiers(
                data.map((tier, index) => ({
                    ...tier,
                    orderIndex: index, // Add an order index to preserve the original position
                    tier_features: tier.tier_features || [{ feature_name: '' }],
                    tier_pricings: tier.tier_pricings || [{ duration_months: '', price: '' }],
                }))
            );
        } catch (error) {
            setError(`Error fetching tiers: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchTiers();
    }, []);

    const handleShowModal = (tier = null) => {
        setSelectedTier(tier);
        setIsEditing(!!tier);
        setShowModal(true);
        setNewTier(
            tier ? 
            {
                ...tier,
                features: (tier.tier_features || [{ feature_name: '' }])
                    .map(feature => ({
                        id: feature.id,
                        feature_name: feature.feature_name,
                        _destroy: false
                    })),
                pricings: tier.tier_pricings || [{ duration_months: '', price: '' }],
            }
            : 
            { 
                name: '', 
                ads_limit: 0, 
                features: [{ feature_name: '' }], 
                pricings: [{ duration_months: '', price: '' }] 
            }
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTier(null);
        setNewTier({ name: '', ads_limit: 0, features: [{ feature_name: '' }], pricings: [{ duration_months: '', price: '' }] });
    };

    const handleSaveTier = async () => {
        setIsLoading(true); // Set loading state to true when the request starts
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${process.env.REACT_APP_BACKEND_URL}/admin/tiers/${selectedTier.id}`
            : `${process.env.REACT_APP_BACKEND_URL}/admin/tiers`;
    
        // Prepare the features data
        const features = newTier.features.map(feature => ({
            id: feature.id,
            feature_name: feature.feature_name,
            _destroy: feature._destroy
        })).filter(feature => feature.feature_name || feature._destroy);
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tier: {
                        name: newTier.name,
                        ads_limit: newTier.ads_limit,
                        tier_features_attributes: features,
                        tier_pricings_attributes: newTier.pricings,
                    }
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to save tier');
            }
    
            const updatedTier = await response.json();
    
            if (isEditing) {
                setTiers(prevTiers =>
                    prevTiers.map(tier =>
                        tier.id === updatedTier.id
                            ? { ...updatedTier, orderIndex: tier.orderIndex }
                            : tier
                    )
                );
            } else {
                setTiers(prevTiers => [...prevTiers, updatedTier]);
            }
    
            handleCloseModal();
        } catch (error) {
            setError(`Error saving tier: ${error.message}`);
        } finally {
            setIsLoading(false); // Set loading state to false after the operation completes
        }
    };

    

    const deleteTier = async (tierId) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert("Authorization token is missing. Please log in again.");
            return;
        }
    
        // Check if the tier is assigned to a seller (this will be based on your database structure)
        const tier = tiers.find(t => t.id === tierId);
        
        if (tier && tier.seller) {
            // Tier is assigned to a seller, prevent deletion
            alert("This tier is already assigned to a seller and cannot be deleted.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/tiers/${tierId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,  // Adding the token in the header
                },
            });
    
            if (response.ok) {
                // If the tier is deleted, update the state to remove it
                setTiers(tiers.filter(t => t.id !== tierId));
            } else {
                alert("Failed to delete the tier.");
            }
        } catch (error) {
            console.error("Error deleting tier:", error);
            alert("An error occurred while deleting the tier.");
        }
    };

    const handleFeatureDelete = (index) => {
        const updatedFeatures = newTier.features.map((feature, i) => {
            if (i === index) {
                if (feature.id) {
                    // If the feature exists in the database, mark it for destruction
                    return { ...feature, _destroy: true };
                }
                // If it's a new feature, we'll filter it out
                return null;
            }
            return feature;
        }).filter(feature => feature !== null);
    
        setNewTier({ ...newTier, features: updatedFeatures });
    };
    

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="tiers-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0 d-flex flex-column">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} lg={9} className="p-2 d-flex flex-column">
                            <Card className="section">
                                <Card.Header className="justify-content-center">
                                    <h3 className="mb-0">Tiers Management</h3>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center">
                                    {tiers.length > 0 ? (
                                        <Container>
                                            <Row className="d-flex align-items-stretch">
                                                {tiers
                                                    .slice() // Create a shallow copy to avoid mutating the original array
                                                    .sort((a, b) => a.id - b.id) // Sort by ID in ascending order
                                                    .map((tier) => (
                                                        <Col xs={12} md={6} lg={3} key={tier.id} className="mb-4">
                                                            <Card className="custom-card shadow-sm rounded-lg h-100">
                                                                <Card.Header className="text-center bg-warning text-black">
                                                                    <h5 className="mb-0">{tier.name}</h5>
                                                                </Card.Header>
                                                                <Card.Body className="d-flex flex-column justify-content-between px-2">
                                                                    <div className="d-flex flex-column flex-grow-1">
                                                                        <p>
                                                                            <strong>Ads Limit:</strong>{' '}
                                                                            {tier.name === 'Premium' ? <span style={{ fontSize: '1.2rem' }}>∞</span> : tier.ads_limit}
                                                                        </p>
                                                                        <h5 className="text-center">Features:</h5>
                                                                        <ul>
                                                                            {tier.tier_features.map((feature, index) => (
                                                                                <li key={index}>
                                                                                    <em>{feature.feature_name}</em>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                        <h5 className="text-center">Pricing:</h5>
                                                                        {tier.id !== 1 ? ( // Only render the pricing list if the tier_id is not 1
                                                                            <ul>
                                                                                {tier.tier_pricings.map((pricing, index) => (
                                                                                    <li key={index} className="d-flex justify-content-center align-items-center">
                                                                                        <Card.Text className="price-container d-flex justify-content-center align-items-center mb-0">
                                                                                            <span className="me-2">{pricing.duration_months} months -</span>
                                                                                            <span>
                                                                                                <em className="ad-price-label text-success">Kshs: </em>
                                                                                            </span>
                                                                                            <strong style={{ fontSize: '17px' }} className="text-danger ms-1">
                                                                                                {pricing.price
                                                                                                    ? parseFloat(pricing.price)
                                                                                                        .toFixed(2)
                                                                                                        .split('.')
                                                                                                        .map((part, i) => (
                                                                                                            <React.Fragment key={i}>
                                                                                                                {i === 0 ? (
                                                                                                                    <span>{parseInt(part, 10).toLocaleString()}</span> // Integer part with commas
                                                                                                                ) : (
                                                                                                                    <>
                                                                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                                                                        <span className="price-decimal">{part}</span>
                                                                                                                    </>
                                                                                                                )}
                                                                                                            </React.Fragment>
                                                                                                        ))
                                                                                                    : 'N/A'}
                                                                                            </strong>
                                                                                        </Card.Text>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p className="text-center text-muted">Free Tier</p> // Message for the free tier
                                                                        )}
                                                                    </div>
                                                                </Card.Body>
                                                                <Card.Footer className="d-flex justify-content-between align-items-center">
                                                                    <Button
                                                                        variant="warning"
                                                                        className="rounded-pill py-1 my-0"
                                                                        onClick={() => handleShowModal(tier)}
                                                                    >
                                                                        <Pencil size={18} />
                                                                    </Button>

                                                                    {/* Delete Button */}
                                                                    <Button
                                                                        variant="danger"
                                                                        className="rounded-pill py-1 my-0 ms-2 text-white"
                                                                        onClick={() => deleteTier(tier.id)}
                                                                        disabled={tier.seller}  // Disable if tier is assigned to a seller
                                                                    >
                                                                        <Trash size={18} />
                                                                    </Button>
                                                                </Card.Footer>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                            </Row>
                                        </Container>
                                    ) : (
                                        <p>No tiers available.</p>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-center">
                                    <Button variant="warning" className="rounded-pill" onClick={() => handleShowModal()}>
                                        Add New Tier
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>

               {/* ====================================== ADD & EDIT TIER MODAL ====================================== */}
                <Modal 
                    centered 
                    show={showModal} 
                    onHide={handleCloseModal} 
                    size="lg"
                    contentClassName="border-0 shadow-lg"
                >
                    <Modal.Header className="border-bottom-0 rounded-top p-2">
                        <div className="d-flex align-items-center justify-content-center w-100">
                            <Modal.Title className="fw-bold text-light text-center">
                                {isEditing ? 'Edit Tier' : 'Add New Tier'}
                            </Modal.Title>
                        </div>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-2">
                        <Form>
                            <Row>
                                <Col md={6} xs={6}>
                                    {/* Ads Limit */}
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-semibold text-dark">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="form-control-md rounded-pill mb-0"
                                            value={newTier.name}
                                            onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                                            placeholder="Enter tier name"
                                            style={{ borderRadius: '8px', borderColor: '#d1d8e1' }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col  md={6} xs={6}>
                                    {/* Ads Limit */}
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-semibold text-dark">Ads Limit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            className="form-control-md rounded-pill mb-0"
                                            value={newTier.ads_limit}
                                            onChange={(e) => setNewTier({ ...newTier, ads_limit: e.target.value })}
                                            placeholder="Enter ads limit"
                                            style={{ borderRadius: '8px', borderColor: '#d1d8e1' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Features */}
                            `<Form.Group className="mb-2">
                                <Form.Label className="fw-semibold d-flex align-items-center text-dark">
                                    <h5 className="me-2">Features</h5>
                                    <span className="badge bg-primary rounded-pill">
                                        {newTier.features.length}
                                    </span>
                                </Form.Label>
                                
                                {/* Features Wrapper */}
                                <div className="features-wrapper">
                                    {newTier.features
                                        .filter(feature => !feature._destroy)  // Only show non-destroyed features
                                        .map((feature, index) => (
                                        <div key={feature.id || index} className="mb-3 px-2 py-1 bg-white rounded shadow-sm d-flex align-items-center">
                                            <Row className="w-100 g-2">
                                                <Col md={11} xs={10} className="d-flex align-items-center">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter feature description"
                                                        className="mt-2 mb-1 form-control-md rounded-pill"
                                                        value={feature.feature_name}
                                                        onChange={(e) => {
                                                            const updatedFeatures = [...newTier.features];
                                                            updatedFeatures[index].feature_name = e.target.value;
                                                            setNewTier({ ...newTier, features: updatedFeatures });
                                                        }}
                                                        style={{ borderRadius: '8px', borderColor: '#d1d8e1' }}
                                                    />
                                                </Col>
                                                <Col md={1} xs={2} className="d-flex align-items-center justify-content-center">
                                                    <Button
                                                        variant="danger"
                                                        className="w-100 rounded-pill mt-2 mb-1"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => handleFeatureDelete(index)}
                                                    >
                                                        <Trash size={18} />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Feature Button */}
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        variant="outline-primary"
                                        className="w-50 rounded-pill"
                                        style={{ borderRadius: '8px' }}
                                        onClick={() => setNewTier({
                                            ...newTier,
                                            features: [
                                                ...newTier.features,
                                                { feature_name: '' },
                                            ],
                                        })}
                                    >
                                        <Plus size={18} className="me-1" />
                                        Add Feature
                                    </Button>
                                </div>
                            </Form.Group>

                            {/* Pricing */}
                            <Form.Group className="mb-2">
                                <Form.Label className="fw-semibold d-flex align-items-center text-dark">
                                    <h5 className="me-2">Pricing Plans</h5>
                                    <span className="badge bg-primary rounded-pill">
                                        {newTier.pricings.length}
                                    </span>
                                </Form.Label>
                                
                                {/* Pricing Plans Wrapper */}
                                <div className="pricing-plans-wrapper">
                                    {newTier.pricings.map((pricing, index) => (
                                        <div key={index} className="mb-3 px-2 py-1 bg-white rounded shadow-sm">
                                            <Row className="g-2 align-items-end">
                                                <Col md={4} xs={4}>
                                                    <Form.Label className="small mb-0"><strong>Duration</strong> (Months)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        className="mt-2 mb-1 form-control-md rounded-pill"
                                                        value={pricing.duration_months}
                                                        onChange={(e) => {
                                                            const updatedPricings = [...newTier.pricings];
                                                            updatedPricings[index].duration_months = e.target.value;
                                                            setNewTier({ ...newTier, pricings: updatedPricings });
                                                        }}
                                                        style={{ borderRadius: '8px', borderColor: '#d1d8e1' }}
                                                    />
                                                </Col>
                                                <Col md={7} xs={6}>
                                                    <Form.Label className="small mb-0"><strong>Price</strong> (Kshs:)</Form.Label>
                                                    <div className="d-flex align-items-center">
                                                        <Form.Control
                                                            type="number"
                                                            className="mt-2 mb-1 form-control-md rounded-pill"
                                                            value={pricing.price}
                                                            onChange={(e) => {
                                                                const updatedPricings = [...newTier.pricings];
                                                                updatedPricings[index].price = e.target.value;
                                                                setNewTier({ ...newTier, pricings: updatedPricings });
                                                            }}
                                                            style={{ borderRadius: '8px', borderColor: '#d1d8e1' }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={1} xs={2} className="d-flex align-items-center justify-content-center">
                                                    <Button
                                                        variant="danger"
                                                        className="w-100 rounded-pill mt-2 mb-2"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => {
                                                            const updatedPricings = newTier.pricings.filter(
                                                                (_, i) => i !== index
                                                            );
                                                            setNewTier({ ...newTier, pricings: updatedPricings });
                                                        }}
                                                    >
                                                        <Trash size={18} />
                                                    </Button>
                                                </Col>

                                            </Row>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Pricing Plan Button */}
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        variant="outline-primary"
                                        className="w-50 rounded-pill"
                                        style={{ borderRadius: '8px' }}
                                        onClick={() => setNewTier({
                                            ...newTier,
                                            pricings: [
                                                ...newTier.pricings,
                                                { duration_months: '', price: '' },
                                            ],
                                        })}
                                    >
                                        <Plus size={18} className="me-1" />
                                        Add Pricing Plan
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="border-top-0 p-2">
                        <Button variant="danger" className="rounded-pill" onClick={handleCloseModal} style={{ borderRadius: '8px' }}>
                            Cancel
                        </Button>
                        <Button
                            variant="warning"
                            className="rounded-pill"
                            onClick={handleSaveTier}
                            style={{ borderRadius: '8px' }}
                            disabled={isLoading} // Disable the button while loading
                        >
                            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default TiersManagement;
