import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Banner from '../components/Banner';
import Spinner from "react-spinkit";
// import AdDetailsModal from '../components/AdDetailsModal';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../css/Home.css';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [ads, setAds] = useState({});
    // const [allAds, setAllAds] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSearchType, setCurrentSearchType] = useState(''); // Track if it's a subcategory search
    const navigate = useNavigate(); // Initialize useNavigate
    const [isComponentMounted, setIsComponentMounted] = useState(false);

    useEffect(() => {
        const fetchCategoriesAndAds = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };
    
                // Fetch categories and subcategories
                const [categoryResponse, subcategoryResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/categories`, { headers }),
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/subcategories`, { headers })
                ]);
    
                if (!categoryResponse.ok || !subcategoryResponse.ok) throw new Error('Failed to fetch categories/subcategories');
    
                const [categoryData, subcategoryData] = await Promise.all([
                    categoryResponse.json(),
                    subcategoryResponse.json()
                ]);
    
                // Structure categories with subcategories
                const categoriesWithSubcategories = categoryData.map(category => ({
                    ...category,
                    subcategories: subcategoryData.filter(sub => sub.category_id === category.id),
                }));
    
                setCategories(categoriesWithSubcategories);
    
                // ✅ Fetch all ads with pagination
                const adResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/buyer/ads?per_page=500`, { headers });
    
                if (!adResponse.ok) throw new Error('Failed to fetch ads');
    
                const adData = await adResponse.json();
                console.log("Ads Response:", adData);  // ✅ Debugging
    
                // ✅ Ensure ads are grouped correctly
                setAds(adData);
            } catch (error) {
                console.error("Fetch Error:", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCategoriesAndAds();
    }, []);

    const location = useLocation();

    // Update the useEffect that handles location search to better manage state
    useEffect(() => {
        setIsComponentMounted(true);
        return () => setIsComponentMounted(false);
    }, [isComponentMounted]);

    // Update the search results useEffect to only run when component is mounted
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        const category = params.get('category');
        const subcategory = params.get('subcategory');

        if (!params.toString()) {
            setSearchResults([]);
            setCurrentSearchType('');
            setIsSearching(false);
            return;
        }

        const fetchSearchResults = async () => {
            setIsSearching(true);
            try {
                const searchQuery = query || '';
                const searchCategory = category || 'All';
                const searchSubcategory = subcategory || 'All';

                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/buyer/ads/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}&subcategory=${encodeURIComponent(searchSubcategory)}&page=1&per_page=20`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch search results');

                const results = await response.json();
                setSearchResults(results);

                if (searchQuery.trim()) {
                    setCurrentSearchType('search');
                } else if (searchSubcategory !== 'All') {
                    setCurrentSearchType(`subcategory-${searchSubcategory}`);
                } else {
                    setCurrentSearchType('category');
                }

                await logAdSearch(searchQuery, searchCategory, searchSubcategory);
            } catch (error) {
                console.error(error);
                setError('Error searching ads');
            } finally {
                setIsSearching(false);
            }
        };

        fetchSearchResults();
    }, [location.search]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    console.log('ads:', ads); // Debugging: Log the ads data

    const handleAdClick = async (adId) => {
        if (!adId) {
            console.error('Invalid adId');
            return;
        }

        try {
            // Log the 'Ad-Click' event before navigating
            await logClickEvent(adId, 'Ad-Click');

            // Navigate to the ad details page without replacing current history entry
            // This preserves the back button functionality
            navigate(`/ads/${adId}`);
        } catch (error) {
            console.error('Error logging ad click:', error);

            // Proceed with navigation even if logging fails
            navigate(`/ads/${adId}`);
        }
    };
    
    // Function to log a click event
    const logClickEvent = async (adId, eventType) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/click_events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    ad_id: adId,
                    event_type: eventType, // e.g., 'Ad-Click'
                }),
            });
    
            if (!response.ok) {
                console.warn('Failed to log click event');
            }
        } catch (error) {
            console.error('Error logging click event:', error);
        }
    };
    

    const handleSearch = (e, category = 'All', subcategory = 'All') => {
        e.preventDefault();

        // Don't search if query is empty and no category/subcategory filters
        if (!searchQuery.trim() && category === 'All' && subcategory === 'All') {
            return;
        }

        // Build search URL with proper parameters
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set('query', searchQuery.trim());
        }
        if (category !== 'All') {
            params.set('category', category);
        }
        if (subcategory !== 'All') {
            params.set('subcategory', subcategory);
        }

        // Navigate to search results
        navigate(`/?${params.toString()}`);
    };

    // Update handleSubcategoryClick to use URL navigation and handle the search properly
    const handleSubcategoryClick = async (subcategoryName, categoryName) => {
        // Navigate to URL with subcategory parameters
        navigate(`/?query=&category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`);
        
        // Log the subcategory click
        await logSubcategoryClick(subcategoryName, categoryName);
    };

    // Function to log subcategory clicks
    const logSubcategoryClick = async (subcategory, category) => {
        try {
            const logResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subcategory_clicks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    subcategory: subcategory,
                    category: category,
                }),
            });

            if (!logResponse.ok) {
                console.warn('Failed to log subcategory click');
            }
        } catch (logError) {
            console.error('Error logging subcategory click:', logError);
        }
    };

    // Function to clear search results and return to home view
    const handleClearSearch = () => {
        // Use replace to avoid adding to history stack
        navigate('/', { replace: true });
        setSearchResults([]);
        setSearchQuery('');
        setCurrentSearchType('');
        setIsSearching(false);
    };

    
    // Function to log the ad search
    const logAdSearch = async (query, category, subcategory) => {
        try {
            const logResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ad_searches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    search_term: query,
                    category: category,
                    subcategory: subcategory,
                }),
            });
    
            if (!logResponse.ok) {
                console.warn('Failed to log ad search');
            }
        } catch (logError) {
            console.error('Error logging ad search:', logError);
        }
    };

    const getBorderColor = (tierId) => {
        const tierColors = {
            1: '#F0FFF0',  // Free (Blue)
            2: '#FF5733',  // Basic (Red-Orange)
            3: '#28A745',  // Standard (Bright Green)
            4: '#FFC107',  // Premium (Gold-like yellow)
        };
        return tierColors[tierId] || 'transparent'; // No border color for Free tier
    };
    
    const CategorySection = ({ title, subcategories }) => {
        // Function to shuffle an array
        const shuffleArray = (array) => {
            return array
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        };
    
        // Shuffle the subcategories before slicing
        const randomizedSubcategories = shuffleArray(subcategories).slice(0, 4);
    
        return (
            <Card className="section bg-transparent mb-3 m-5 my-xs-0 mx-5">
                <Card.Header className="category-header justify-content-start">
                    <h4 className='m-0'>{title}</h4>
                </Card.Header>
                <Card.Body className='cat-body p-0'>
                    <Row className="g-3">
                        {randomizedSubcategories.map(subcategory => (
                            <Col xs={12} sm={6} md={3} key={subcategory.id}>
                                <SubcategorySection
                                    subcategory={subcategory.name}
                                    categoryName={title}
                                    ads={ads[subcategory.id] || []}
                                    onAdClick={handleAdClick}
                                    onSubcategoryClick={handleSubcategoryClick}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    const SubcategorySection = ({ subcategory, categoryName, ads, onAdClick, onSubcategoryClick }) => {
        const displayedAds = ads.slice(0, 4);
        return (
            <Card className="subcategory-section h-100">
                <Card.Body className="p-2">
                    <Row className="g-2">
                        {displayedAds.map(ad => {
                            const borderColor = getBorderColor(ad.seller_tier); // Get the border color
                            return (
                                <Col xs={6} key={ad.id}>
                                    <Card 
                                        className="ad-card h-100"
                                        style={{
                                            border: `2px solid ${borderColor}`,
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            {/* Tier label */}
                                            <div
                                                className="tier-label text-dark"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0px',
                                                    left: '0px',
                                                    padding: '0px 5px',
                                                    fontSize: '12px',
                                                    backgroundColor: borderColor, // Match background to border color
                                                    borderRadius: '4px',
                                                    zIndex: 20,
                                                }}
                                            >
                                                {ad.tier_name}
                                            </div>
        
                                            <Card.Img
                                                variant="top"
                                                loading="lazy"
                                                src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}
                                                alt={ad.title}
                                                className="ad-image"
                                                onClick={() => onAdClick(ad.id)}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-start">
                    <h5 
                        className='m-0 subcategory-title' 
                        onClick={() => onSubcategoryClick(subcategory, categoryName)}
                        style={{ 
                            cursor: 'pointer',
                            transition: 'color 0.3s ease, transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#007bff';
                            e.target.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '';
                            e.target.style.transform = 'translateX(0)';
                        }}
                    >
                        {subcategory}
                    </h5>
                </Card.Footer>
            </Card>
        );
    };

    const PopularAdsSection = ({ ads, onAdClick }) => (
        
        <Card className="section bg-transparent mb-3 m-4 mx-5">
            <Card.Header className="d-flex justify-content-start popular-ads-header">
                <h3 className='mb-0'>Best Sellers</h3>
            </Card.Header>
            <Card.Body className="cat-body">
                <Row className="g-3">
                    
                    {ads.slice(0, 6).map(ad => {
                        const borderColor = getBorderColor(ad.seller_tier);
                        console.log("ad", ad);
                        console.log("borderColor", getBorderColor(ad.seller_tier));
                        
                        
                        return (
                            <Col xs={6} sm={6} md={4} lg={3} key={ad.id}>
                                <Card
                                    className="ad-card h-100"
                                    style={{
                                        border: `2px solid ${borderColor}`,
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        {/* Tier label */}
                                        <div
                                            className="tier-label text-dark"
                                            style={{
                                                position: 'absolute',
                                                top: '0px',
                                                left: '0px',
                                                padding: '0px 5px',
                                                fontSize: '12px',
                                                backgroundColor: borderColor, // Match background to border color
                                                borderRadius: '4px',
                                                zIndex: 20,
                                            }}
                                        >
                                            {ad.tier_name}
                                        </div>
                                        
                                        <Card.Img 
                                            variant="top" 
                                            src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}
                                            alt={ad.title}
                                            className="ad-image"
                                            onClick={() => onAdClick(ad.id)} 
                                        />
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Card.Body>
        </Card>
    );

    const SearchResultSection = ({ results, searchType }) => {
        const getHeaderTitle = () => {
            if (typeof searchType === 'string' && searchType.startsWith('subcategory-')) {
                const rawName = searchType.replace('subcategory-', '');
                const formatted = rawName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return `${formatted} Products`;
            }
            return 'Search Results';
        };

        return (
            <Card className="section-search mb-4 mt-2">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">{getHeaderTitle()}</h3>
                    <Button 
                        variant="outline-secondary bg-warning rounded-pill text-dark" 
                        size="sm" 
                        onClick={handleClearSearch}
                        className="d-flex align-items-center gap-2"
                    >
                        Back to Home
                    </Button>
                </Card.Header>
                <Card.Body>
                    {results.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-muted">No products found</h5>
                            <p className="text-muted">Try adjusting your search or browse other categories</p>
                        </div>
                    ) : (
                        <Row className="g-3">
                            {results.map(ad => {
                                const borderColor = getBorderColor(ad.seller_tier); // Get the border color
                                return (
                                    <Col xs={6} sm={6} md={2} key={ad.id} className="">
                                        <Card 
                                            className="ad-card-seller mb-3" 
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                            }}>
                                            <div style={{ position: 'relative' }}>
                                                {/* Tier label */}
                                                <div
                                                    className="tier-label text-dark"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0px',
                                                        right: '-2px',
                                                        padding: '2px 6px',
                                                        fontSize: '11px',
                                                        backgroundColor: borderColor,
                                                        borderTopLeftRadius: '0px',
                                                        borderTopRightRadius: '4px',
                                                        borderBottomRightRadius: '0px',
                                                        borderBottomLeftRadius: '6px',
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    {ad.tier_name || "Free"} {/* Show tier name, default to "Free" */}
                                                </div>
                                                
                                                <Card.Img
                                                    variant="top"
                                                    src={ad.media_urls && ad.media_urls.length > 0 ? ad.media_urls[0] : 'default-image-url'}
                                                    alt={ad.title}
                                                    className="analytics-card-img-top ad-image"
                                                    onClick={() => handleAdClick(ad.id)} // Handle image click
                                                />
                                            </div>
                                            <Card.Body className="px-2 py-1">
                                                <Card.Title className="mb-0 ad-title">{ad.title}</Card.Title>
                                                <Card.Text className="price-container">
                                                    <span><em className='ad-price-label text-success'>Kshs: </em></span>
                                                    <strong className='text-danger'>
                                                        {ad.price ? parseFloat(ad.price).toFixed(2).split('.').map((part, index) => (
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
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </Card.Body>
            </Card>
        );
    };    

    const Footer = () => (
        <footer className=" text-white position-relative overflow-hidden footer-container" style={{ backgroundColor: '#000000', zIndex: 10 }}>
            {/* Subtle background pattern */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5">
            <div style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,193,7,.1) 35px, rgba(255,193,7,.1) 70px)',
                width: '100%',
                height: '100%'
            }}></div>
            </div>
        
            <div className="position-relative">
            {/* Main Footer Content */}
            <div className="pt-5 pb-4">
                <Container>
                {/* Footer Header */}
                
        
                <Row className="g-4 mb-4">
                    {/* Shopping Guide */}
                    <Col xs={12} md={6} lg={3}>
                    <div className="footer-section">
                        <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></div>
                        <h5 className="text-uppercase fw-bold mb-0" style={{ color: '#ffc107', fontSize: '0.95rem' }}>
                            Shopping Guide
                        </h5>
                        </div>
                        <ul className="list-unstyled footer-links">
                        <li className="mb-2">
                            <a href="/how-to-pay" className="text-white text-decoration-none hover-link">
                            How Do I Pay?
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/how-to-shop" className="text-white text-decoration-none hover-link">
                            How Do I Shop?
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/flash-sales" className="text-white text-decoration-none hover-link">
                            <Badge bg="warning" text="dark" className="me-2 small">Hot</Badge>
                            Flash Sales / Deals
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/about-us" className="text-white text-decoration-none hover-link">
                            About Us
                            </a>
                        </li>
                        </ul>
                    </div>
                    </Col>
        
                    {/* Customer Help Center */}
                    <Col xs={12} md={6} lg={3}>
                    <div className="footer-section">
                        <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></div>
                        <h5 className="text-uppercase fw-bold mb-0" style={{ color: '#ffc107', fontSize: '0.95rem' }}>
                            Customer Help
                        </h5>
                        </div>
                        <ul className="list-unstyled footer-links">
                        <li className="mb-2">
                            <a href="/dispute-resolution" className="text-white text-decoration-none hover-link">
                            Dispute Resolution
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/terms-and-conditions" className="text-white text-decoration-none hover-link">
                            Terms & Conditions
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/faqs" className="text-white text-decoration-none hover-link">
                            FAQs Center
                            </a>
                        </li>
                        </ul>
                    </div>
                    </Col>
        
                    {/* Business */}
                    <Col xs={12} md={6} lg={3}>
                    <div className="footer-section">
                        <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></div>
                        <h5 className="text-uppercase fw-bold mb-0" style={{ color: '#ffc107', fontSize: '0.95rem' }}>
                            Business
                        </h5>
                        </div>
                        <ul className="list-unstyled footer-links">
                        <li className="mb-2">
                            <a href="/become-a-seller" className="text-white text-decoration-none hover-link">
                            <Badge bg="success" className="me-2 small">New</Badge>
                            Become a Seller
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/seller-help" className="text-white text-decoration-none hover-link">
                            Seller Help Center
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/faqs" className="text-white text-decoration-none hover-link">
                            Business FAQs
                            </a>
                        </li>
                        </ul>
                    </div>
                    </Col>
        
                    {/* Let's Connect */}
                    <Col xs={12} md={6} lg={3}>
                    <div className="footer-section">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-warning rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></div>
                                <h5 className="text-uppercase fw-bold mb-0" style={{ color: '#ffc107', fontSize: '0.95rem' }}>
                                    Let's Connect
                                </h5>
                            </div>
                            <p className="text-white-50 small mb-3">
                            Follow us for updates, deals, and marketplace news
                            </p>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <a 
                                    href="https://www.linkedin.com/company/carbon-cube-kenya/?viewAsMember=true"
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="social-link bg-primary bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <FontAwesomeIcon icon={faLinkedinIn} size="sm" />
                                </a>
                                <a 
                                    href="https://wa.me/254712990524" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="social-link bg-success bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                                </a>
                                <a 
                                    href="https://www.instagram.com/carboncube_ke/"
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="social-link bg-danger bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <FontAwesomeIcon icon={faInstagram} size="sm" />
                                </a>
                                <a 
                                    href="https://www.facebook.com/profile.php?id=61574066312678" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="social-link bg-info bg-opacity-20 text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <FontAwesomeIcon icon={faFacebook} size="sm" />
                                </a>
                            </div>
                        <Button variant="outline-warning" size="sm" className="rounded-pill px-3">
                        Newsletter
                        </Button>
                    </div>
                    </Col>
                </Row>
        
                {/* Newsletter Section */}
                <div className="bg-dark bg-opacity-50 rounded-4 p-4 mb-4">
                    <Row className="align-items-center">
                    <Col md={8}>
                        <h6 className="fw-bold text-warning mb-2">Stay Updated</h6>
                        <p className="text-white-50 mb-0 small">
                        Get the latest deals, new arrivals, and marketplace updates delivered to your inbox
                        </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Button variant="warning" className="rounded-pill px-4">
                        Subscribe Now
                        </Button>
                    </Col>
                    </Row>
                </div>
                </Container>
            </div>
        
            {/* Footer Bottom */}
            <div className="border-top border-secondary border-opacity-25 py-3">
                <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                    <div className="text-white small">
                        &copy; {new Date().getFullYear()} <span className="text-warning fw-bold">CarbonCube Kenya</span>. All rights reserved.
                    </div>
                    </Col>
                    <Col md={6} className="text-md-end mt-2 mt-md-0">
                    <div className="d-flex flex-wrap justify-content-md-end gap-3">
                        <a href="/privacy" className="text-white small text-decoration-none hover-link">Privacy Policy</a>
                        <a href="/cookies" className="text-white small text-decoration-none hover-link">Cookies</a>
                        <a href="/sitemap" className="text-white small text-decoration-none hover-link">Sitemap</a>
                    </div>
                    </Col>
                </Row>
                </Container>
            </div>
            </div>
        
            <style jsx>{`
            .hover-link {
                transition: color 0.3s ease, transform 0.2s ease;
            }
            .hover-link:hover {
                color: #ffc107 !important;
                transform: translateX(5px);
            }
            .social-link {
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .social-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
                border-color: #ffc107;
            }
            .footer-section {
                padding: 1rem;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }
            .footer-section:hover {
                background-color: rgba(255, 255, 255, 0.02);
            }
            `}</style>
        </footer>
    );

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
            <TopNavbar
                onSidebarToggle={handleSidebarToggle}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />
            <div className="home-page-wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className={`home-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    {!isSearching && searchResults.length === 0 && <Banner />}
                    <Container fluid className="mb-0">
                        {isSearching ? (
                            <div className="centered-loader">
                                <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <SearchResultSection results={searchResults} searchType={currentSearchType} />
                        ) : (
                            <>
                            <div className="categories-overlay">
                                {categories.map((category) => (
                                    <CategorySection
                                        key={category.id}
                                        title={category.name}
                                        subcategories={category.subcategories}
                                    />
                                ))}
                                <PopularAdsSection
                                    ads={Object.values(ads).flat()}
                                    onAdClick={handleAdClick}
                                />
                                </div>
                            </>
                        )}
                    </Container>
                    
                </div>
            </div>
            <div className='lorem'>
                <Footer />
            </div>
            {/* <AdDetailsModal
                    show={showModal}
                    onHide={handleCloseModal}
                    ad={selectedAd}
                />  */}
                
        </>
    );
};

export default Home;