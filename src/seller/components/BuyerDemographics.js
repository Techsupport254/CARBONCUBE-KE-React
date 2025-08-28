import React from 'react';
import BuyerClickEvents from './BuyerClickEvents';
import BuyerWishlistStats from './BuyerWishlistStats'; // Ensure both components are imported
import { Col, Row } from 'react-bootstrap';
import './BuyerDemographics.css';

const BuyerDemographics = ({ data }) => {
  const { clickEvents, wishlistStats } = data;

  if (!clickEvents || !wishlistStats) {
    return <div>Loading...</div>; // Handle missing data
  }

  return (
    <div className="buyer-stats">
      {/* Pass both clickEvents and wishlistStats to the relevant components */}
      <Row>
        <Col xs={12} md={6} lg={6} className="mb-4"><BuyerClickEvents data={clickEvents} /></Col>
        <Col xs={12} md={6} lg={6} className="mb-4"><BuyerWishlistStats data={wishlistStats} /></Col>
      </Row>
    </div>
  );
};

export default BuyerDemographics;
