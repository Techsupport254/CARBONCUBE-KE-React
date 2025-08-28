import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/CategoriesManagement.css'; // Custom CSS

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', subcategories: [{ name: '' }] });

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/categories`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            // console.error('Error fetching categories:', error);
            setError('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    
    const handleShowModal = (category = null) => {
        setSelectedCategory(category);
        setIsEditing(!!category);
        setShowModal(true);
        setNewCategory(category
            ? {
                ...category,
                subcategories: category.subcategories.map(sub => ({ id: sub.id, name: sub.name }))
            }
            : { name: '', subcategories: [{ name: '' }] }
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategory(null);
        setNewCategory({ name: '', subcategories: [{ name: '' }] });
    };

    const handleSaveCategory = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
            ? `${process.env.REACT_APP_BACKEND_URL}/admin/categories/${selectedCategory.id}` 
            : `${process.env.REACT_APP_BACKEND_URL}/admin/categories`;
    
        try {
            // Save or update the category
            const categoryResponse = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory.name }),
            });
    
            if (!categoryResponse.ok) {
                const errorText = await categoryResponse.text();
                throw new Error(`Failed to save category: ${categoryResponse.status} - ${errorText}`);
            }
    
            const savedCategory = await categoryResponse.json();
    
            // Handle subcategories
            const existingSubcategories = categories.find(cat => cat.id === savedCategory.id)?.subcategories || [];
            const savedSubcategoryIds = new Set(existingSubcategories.map(sub => sub.id));
    
            // Save or update subcategories
            const newlyCreatedSubcategories = [];
            for (const subcategory of newCategory.subcategories) {
                const subcategoryMethod = subcategory.id ? 'PUT' : 'POST';
                const subcategoryUrl = subcategory.id
                    ? `${process.env.REACT_APP_BACKEND_URL}/admin/subcategories/${subcategory.id}`
                    : `${process.env.REACT_APP_BACKEND_URL}/admin/subcategories`;
    
                const subcategoryResponse = await fetch(subcategoryUrl, {
                    method: subcategoryMethod,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: subcategory.name,
                        category_id: savedCategory.id,
                    }),
                });
    
                if (!subcategoryResponse.ok) {
                    const errorText = await subcategoryResponse.text();
                    throw new Error(`Failed to save subcategory: ${subcategoryResponse.status} - ${errorText}`);
                }
    
                const savedSubcategory = await subcategoryResponse.json();
                savedSubcategoryIds.add(savedSubcategory.id);
    
                // Track newly created subcategories to ensure they aren't deleted
                if (!subcategory.id) {
                    newlyCreatedSubcategories.push(savedSubcategory.id);
                }
            }
    
            // Handle deletions, but exclude newly created subcategories
            const newSubcategoryIds = new Set(newCategory.subcategories.filter(sub => sub.id).map(sub => sub.id));
            const subcategoriesToDelete = Array.from(savedSubcategoryIds).filter(
                id => !newSubcategoryIds.has(id) && !newlyCreatedSubcategories.includes(id)
            );
    
            for (const subcategoryId of subcategoriesToDelete) {
                const subcategoryUrl = `${process.env.REACT_APP_BACKEND_URL}/admin/subcategories/${subcategoryId}`;
    
                const deleteResponse = await fetch(subcategoryUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!deleteResponse.ok) {
                    const errorText = await deleteResponse.text();
                    throw new Error(`Failed to delete subcategory: ${deleteResponse.status} - ${errorText}`);
                }
            }
    
            handleCloseModal();
            setLoading(true);
    
            // Re-fetch categories after saving
            await fetchCategories();
        } catch (error) {
            // console.error('Error saving category or subcategory:', error.message);
            setError(`Error saving category or subcategory: ${error.message}`);
        }
    };

    const handleAddSubcategory = () => {
        setNewCategory({ ...newCategory, subcategories: [...newCategory.subcategories, { name: '' }] });
    };

    const handleRemoveSubcategory = (index) => {
        const updatedSubcategories = [...newCategory.subcategories];
        updatedSubcategories.splice(index, 1);
        setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
    };

    const handleChangeSubcategory = (index, value) => {
        const updatedSubcategories = [...newCategory.subcategories];
        updatedSubcategories[index].name = value;
        setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
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
            <div className="categories-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0 d-flex flex-column">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} lg={9} className="p-2 d-flex flex-column">
                            <Card className="section">
                                <Card.Header className="justify-content-center">
                                    <h3 className="mb-0">Categories</h3>
                                </Card.Header>
                                <Card.Body className="p-0 m-0">
                                    {categories.length > 0 ? (
                                        <Container>
                                            <Row>
                                                {categories.map((category) => (
                                                    <Col xs={12} md={6} lg={6} key={category.id} className="mb-1 p-1 p-lg-2">
                                                        <Card className="custom-card">
                                                            <Card.Header className="justify-content-center">
                                                                <h4 className="mb-0">{category.name}</h4>
                                                            </Card.Header>
                                                            <Card.Body className="justify-content-between align-items-center">
                                                                <ul>
                                                                    {category.subcategories.map((subcategory, index) => (
                                                                        <li key={index} className="subcategory-item">
                                                                            {subcategory.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-end p-1">
                                                                <Button variant="warning" id="button" onClick={() => handleShowModal(category)}>
                                                                    Edit
                                                                </Button>
                                                            </Card.Footer>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Container>
                                    ) : (
                                        <p>No categories available</p>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-center p-1">
                                    <Button variant="warning" id="button" onClick={() => handleShowModal()}>
                                        Add New Category
                                    </Button>
                                </Card.Footer>
                            </Card>
                            <Modal centered show={showModal} onHide={handleCloseModal} size="xl">
                                <Modal.Header className="justify-content-center p-1 p-lg-2">
                                    <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="py-1 px-2">
                                    <Form>
                                        <Form.Group controlId="categoryName">
                                            <Form.Group>
                                                <div className="text-center">
                                                    <Form.Label><h4><strong>Category Name</strong></h4></Form.Label>
                                                </div>
                                            </Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter category name"
                                                className="me-2 mb-2"
                                                id="button"
                                                value={newCategory.name}
                                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <div className="text-center">
                                                <Form.Label><h5><strong>Subcategories</strong></h5></Form.Label>
                                            </div>
                                        </Form.Group>
                                        {newCategory.subcategories.map((subcategory, index) => (
                                            <Form.Group key={index} className="d-flex align-items-center">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter subcategory name"
                                                    className="me-2 mb-2"
                                                    id="button"
                                                    value={subcategory.name}
                                                    onChange={(e) => handleChangeSubcategory(index, e.target.value)}
                                                />
                                                <Button variant="danger" id="button" onClick={() => handleRemoveSubcategory(index)}>
                                                    Remove
                                                </Button>
                                            </Form.Group>
                                        ))}
                                        <Button variant="success" id="button" onClick={handleAddSubcategory}>
                                            Add Subcategory
                                        </Button>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer className="p-0 p-lg-1">                                    
                                    <Button variant="warning" onClick={handleSaveCategory}>
                                        Save Changes
                                    </Button>
                                    <Button variant="danger" onClick={handleCloseModal}>
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

export default CategoriesManagement;
