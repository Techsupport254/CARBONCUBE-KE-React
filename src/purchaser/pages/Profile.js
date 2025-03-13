import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import { formatDate } from '../utils/formatDate';
import '../css/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        fullname: '',
        username: '',
        email: '',
        phone_number: '',
        zipcode: '',
        gender: '',
        location: '',
        city: '',
        birthdate: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // State for modal visibility
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordMatch, setPasswordMatch] = useState(true);

    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem('token'); // Adjust the key to match your app

    // Fetch profile data from the backend API
    useEffect(() => {
        if (!token) {
        // console.error('No auth token found');
        return;
        }

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchaser/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            // console.error('Error fetching profile data:', error);
            if (error.response.status === 401) {
            // console.error('Unauthorized access. Please login again.');
            }
        });
    }, [token]);

    // Handle input change for editing the profile
    const handleChange = (e) => {
        setProfile({
        ...profile,
        [e.target.name]: e.target.value,
        });
    };

    // Toggle edit mode
    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    // Handle form submission to save updated profile
    const handleSaveClick = () => {
        if (!token) {
        // console.error('No auth token found');
        return;
        }

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/purchaser/profile`, profile, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            setProfile(response.data);
            setEditMode(false);
        })
        .catch(error => {
            // console.error('Error saving profile data:', error);
        });
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setPasswordData({ ...passwordData, confirmPassword: value });
        
        // Check if newPassword matches confirmPassword in real time
        if (passwordData.newPassword !== value) {
            setPasswordMatch(false);
        } else {
            setPasswordMatch(true);
        }
    };

    // Handle Change Password
    const handlePasswordChange = () => {
        // Check if the new password matches the confirm password
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
    
        // Proceed with the rest of the password change logic
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/purchaser/profile/change-password`, {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            alert("Password changed successfully. Please log in again.");
            toggleChangePasswordModal();
            sessionStorage.removeItem('token'); // Clear token to force login
            window.location.href = '/login'; // Redirect to login page
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                alert("Current password is incorrect.");
            } else {
                alert("Error changing password.");
            }
        });
    };
    
    

    // Toggle Modal
    const toggleChangePasswordModal = () => setShowChangePasswordModal(!showChangePasswordModal);

    return (
        <>
        <TopNavbar />
            <div className="profile-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={9} className="p-2">
                            <div className="profile-container">
                                <Container>
                                    <Row className="align-items-center text-center vertical-center d-flex mb-0">
                                        {/* Left Side: Welcome Message and Date */}
                                        <Col xs={8} md={6} lg={6} className="d-flex justify-content-start">
                                            <div className="mt-4">
                                                <h3>Welcome, <em className="text-primary">{profile.fullname}</em></h3>
                                                <p>{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </Col>

                                        {/* Right Side: Profile Picture and Username */}
                                        <Col xs={4} md={6} lg={6} className="d-flex justify-content-end">
                                            <div className="text-right">
                                                <img src={profile.profile_picture} alt="Profile" className="profile-pic" />
                                                <p>@{profile.username}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>                                
                                <div className="profile-info">
                                    <Form>
                                        {/* Bio Section */}
                                        <Container className="mb-4">
                                            <Row>
                                                <Col className="justify-content-center">
                                                    <h4 className="section-heading text-center mb-0">Bio</h4>
                                                    <hr />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formFullName">
                                                        <Form.Label>Full Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="fullname"
                                                            value={profile.fullname}
                                                            onChange={handleChange}
                                                            disabled={editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="formGender">
                                                        <Form.Label>Gender</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="gender"
                                                            value={profile.gender}
                                                            onChange={handleChange}
                                                            disabled={editMode}
                                                        >
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formBirthDate">
                                                        <Form.Label>Birth Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            name="birthdate"
                                                            value={formatDate(profile.birthdate) || ''} // Format birthdate to YYYY-MM-DD
                                                            onChange={handleChange}
                                                            disabled={editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="formUsername">
                                                        <Form.Label>Username</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="username"
                                                            value={profile.username}
                                                            onChange={handleChange}
                                                            disabled={editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Container>

                                        {/* Contact Information Section */}
                                        <Container>
                                            <Row>
                                                <Col className="justify-content-center">
                                                    <h4 className="section-heading text-center">Contact Information</h4>
                                                    <hr />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            value={profile.email}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="formPhoneNumber">
                                                        <Form.Label>Phone Number</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="phone_number"
                                                            value={profile.phone_number}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formAddress">
                                                        <Form.Label>Physical Address</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="location"
                                                            value={profile.location}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="formCity">
                                                        <Form.Label>City</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="city"
                                                            value={profile.city}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId="formZipCode">
                                                        <Form.Label>Zip Code (Optional)</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="zipcode"
                                                            value={profile.zipcode}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}></Col>
                                            </Row>

                                            {/* Buttons Section */}
                                            <Row className="button-row d-flex justify-content-between align-items-center">
                                                <Col md={4} className="d-flex justify-content-start">
                                                    <Button variant="warning" id="button" onClick={handleEditClick}>
                                                        {editMode ? 'Cancel' : 'Edit'}
                                                    </Button>
                                                </Col>
                                                <Col md={4} className="d-flex justify-content-center">
                                                    <Button variant="info" id="button" onClick={toggleChangePasswordModal}>Change Password</Button>
                                                </Col>
                                                <Col md={4} className="d-flex justify-content-end">
                                                    {editMode && (
                                                        <Button variant="success" id="button" onClick={handleSaveClick} className="me-2">
                                                            Save
                                                        </Button>
                                                    )}
                                                    <Button variant="danger" id="button" className="ml-2">
                                                        Delete Account
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {/* Change Password Modal */}
                <Modal centered show={showChangePasswordModal} onHide={toggleChangePasswordModal}>
                    <Modal.Header>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCurrentPassword">
                                <Form.Label><strong>Current Password</strong></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label><strong>New Password</strong></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword">
                                <Form.Label><strong>Confirm New Password</strong></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                                {!passwordMatch && (
                                    <Form.Text className="text-danger">
                                        New password and confirm password do not match.
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={toggleChangePasswordModal}>
                            Close
                        </Button>
                        <Button
                            variant="warning"
                            onClick={handlePasswordChange}
                            disabled={!passwordMatch} // Disable save if passwords do not match
                        >
                            Save Password
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ProfilePage;
