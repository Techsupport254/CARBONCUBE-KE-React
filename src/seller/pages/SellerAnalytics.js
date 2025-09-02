import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import ClickEventsStats from '../components/ClickEventsStats';
import TopWishListedAds from '../components/TopWishListedAds';
import WishListStats from '../components/WishListStats';
import CompetitorStats from '../components/CompetitorStats';
import CountDownDisplay from '../components/CountDownDisplay';
import BuyerDemographics from "../components/BuyerDemographics";
import Spinner from "react-spinkit";
import { format, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/SellerAnalytics.css';

const SellerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [tierId, setTierId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/analytics`, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        			// API Response data

        const validatedAnalytics = {
          tier_id: data.tier_id || 1,
          total_ads: data.total_ads || 0,
          total_reviews: data.total_reviews || 0,
          average_rating: data.average_rating || 0.0,
          top_wishlisted_ads: Array.isArray(data.basic_wishlist_stats?.top_wishlisted_ads) 
            ? data.basic_wishlist_stats.top_wishlisted_ads 
            : [],  // Ensure it's always an array
          click_events_stats: data.click_events_stats || {
            age_groups: [],
            income_ranges: [],
            education_levels: [],
            employment_statuses: [],
            sectors: []
          },
          basic_click_event_stats: data.basic_click_event_stats || {
            click_event_trends: []
          },
          wishlist_stats: data.wishlist_stats || {
            top_age_groups: [],
            top_income_ranges: [],
            top_education_levels: [],
            top_employment_statuses: [],
            top_by_sectors: []
          },
          basic_wishlist_stats: data.basic_wishlist_stats || {
            wishlist_trends: []
          },
          competitor_stats: data.competitor_stats || {
            revenue_share: {
              seller_revenue: 0,
              total_category_revenue: 0,
              revenue_share: 0
            },
            top_competitor_ads: [],
            competitor_average_price: 0
          }
        };

        			// Validated Analytics data

        setTierId(validatedAnalytics.tier_id);
        setAnalyticsData(validatedAnalytics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleReplyClick = (review) => {
    setEditingReplyId(review.id);
    setReplyDraft(review.seller_reply || '');
  };

  const handleReplySave = async (reviewId) => {
    if (!reviewId || !replyDraft.trim()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/seller/reviews/${reviewId}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify({ seller_reply: replyDraft }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit reply");

      // Refresh reviews list and reset state
      await fetchReviews();
      setEditingReplyId(null);
      setReplyDraft('');
    } catch (err) {
      console.error(err);
      alert("Failed to submit reply. Please try again.");
    }
  };


  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/reviews`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
    } finally {
      setLoadingReviews(false);
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
    return (
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} className="text-center mt-4">
            <h4>Error Loading Data</h4>
            <p>{error}</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} className="text-center mt-4">
            <h4>No Analytics Data Available</h4>
            <p>Upgrade your package to access analytics data.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  const {  average_rating, total_ads, total_reviews, top_wishlisted_ads } = analyticsData;

  return (
    <>
      <TopNavbar />
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} lg={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} lg={9} className="content-area">
            <Row>
              {/* Analytics Cards */}
              <Col xs={12}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Subscription Countdown</Card.Header>
                  <Card.Body className="text-center">
                    <CountDownDisplay />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Ads</Card.Header>
                  <Card.Body>
                    {tierId >= 2 ? (
                      <Card.Text className="text-center" style={{ fontSize: '1.3rem'}}>
                        <strong>{total_ads.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-secondary">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Basic Tier
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Reviews</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <Card.Text
                        className="text-center text-primary"
                        role="button"
                        style={{ fontSize: '1.3rem', textDecoration: 'underline' }}
                        onClick={() => {
                          setShowReviewsModal(true);
                          fetchReviews();
                        }}
                      >
                        <strong>{total_reviews.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-secondary">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Average Rating</Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center" style={{ fontSize: '1.3rem'}}>
                      <strong>{average_rating.toFixed(1)}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
            <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Top Wishlisted Ads</Card.Header>
                  <Card.Body>
                    {top_wishlisted_ads.length > 0 ? (
                      <TopWishListedAds data={top_wishlisted_ads} />
                    ) : (
                      <p className="text-center text-secondary">
                        No wishlisted ads found. <br />
                        <small>(Make sure your ads are added to wishlists by users.)</small>
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Competitor Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 3 ? ( // Adjust the required tier level if needed
                      <div>
                        <CompetitorStats data={analyticsData.competitor_stats} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Click Events Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 2 ? ( // Adjust the required tier level if needed
                      <div>
                        <ClickEventsStats data={analyticsData.basic_click_event_stats.click_event_trends} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Basic Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Wish List Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 3 ? ( // Adjust the required tier level if needed
                      <div>
                        <WishListStats data={analyticsData.basic_wishlist_stats} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Buyer Demographics</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <BuyerDemographics
                        data={{
                          clickEvents: analyticsData.click_events_stats,
                          wishlistStats: analyticsData.wishlist_stats,
                        }}
                      />
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              </Row>
          </Col>
        </Row>
        
        <Modal
          show={showReviewsModal}
          onHide={() => setShowReviewsModal(false)}
          centered
          size="xl"
          backdrop="static"
          keyboard={false}
          dialogClassName="glass-modal"
        >
          <Modal.Header className="text-white py-2 justify-content-center">
            <Modal.Title className="fw-bold">
              <i className="bi bi-star-half me-2"></i> Buyer Reviews
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loadingReviews ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Card key={review.id || idx} className="mb-3 border-0 shadow-sm">
                  <Card.Body className="bg-white rounded">
                    <div className="d-flex align-items-start">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.buyer_name)}&background=random`}
                        className="rounded-circle me-3"
                        alt="Avatar"
                        width="60"
                        height="60"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          {/* Left: Buyer name */}
                          <div className="d-flex align-items-center">
                            <h6 className="fw-semibold text-dark mb-0 me-2">
                              {review.buyer_name || `Buyer #${review.buyer_id}`}
                            </h6>
                            {/* Rating right of name */}
                            <div className="text-warning">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              <small className="text-muted ms-1">({review.rating}/5)</small>
                            </div>
                          </div>

                          {/* Right: Timestamp */}
                          <small
                            className="text-muted text-nowrap"
                            style={{ fontSize: '0.70rem' }}
                          >
                            {review.updated_at
                              ? isToday(new Date(review.updated_at))
                                ? `Today at ${format(new Date(review.updated_at), 'HH:mm')}`
                                : format(new Date(review.updated_at), 'PP HH:mm')
                              : "No date"}
                          </small>
                        </div>

                        <p className="text-muted fst-italic mb-2">
                          {review.review || 'No review provided.'}
                        </p>

                        {editingReplyId === review.id ? (
                        <div
                          className="bg-light p-2 ps-4 rounded border-start border-3 border-success mb-2"
                          style={{
                            fontSize: '0.85rem',
                            color: '#444',
                            marginLeft: '1.5rem',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <Form.Group controlId={`replyText-${review.id}`}>
                            <Form.Label className="text-success d-block mb-1">Your Reply:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={replyDraft}
                              onChange={(e) => setReplyDraft(e.target.value)}
                            />
                          </Form.Group>
                          <div className="text-end mt-2">
                            <Button
                              variant="success"
                              className="rounded-pill py-0 px-3"
                              size="sm"
                              onClick={() => handleReplySave(review.id)}
                            >
                              <i className="bi bi-check-circle me-1"></i> Save
                            </Button>
                          </div>
                        </div>
                      ) : review.seller_reply ? (
                        <div
                          className="bg-light p-2 ps-4 rounded border-start border-3 border-success mb-2 position-relative"
                          style={{
                            fontSize: '0.85rem',
                            color: '#444',
                            marginLeft: '1.5rem',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <strong className="text-success d-block mb-1">Your Reply:</strong>
                          <p className="mb-0 fst-italic pe-4">{review.seller_reply}</p>
                          <Button
                            variant="transparent"
                            className="position-absolute top-0 end-0 m-2 p-1 border-0"
                            style={{ width: '1.8rem', height: '1.8rem' }}
                            onClick={() => handleReplyClick(review)}
                          >
                            <FontAwesomeIcon icon={faPencilAlt} style={{ fontSize: '1rem', color: '#28a745' }} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline-warning"
                          className="rounded-pill text-dark mt-1 py-0"
                          size="sm"
                          onClick={() => handleReplyClick(review)}
                        >
                          Reply
                        </Button>
                      )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-chat-left-dots fs-1 mb-3"></i>
                <p>No reviews have been submitted yet.</p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="py-1">
            <Button variant="danger" onClick={() => setShowReviewsModal(false)}>
              <i className="bi bi-x-circle me-1"></i> Close
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>
  );
};

export default SellerAnalytics;
