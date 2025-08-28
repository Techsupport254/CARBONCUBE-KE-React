import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './TopWishListedAds.css';

const TopWishListedAds = ({ data }) => {
  return (
    <Row>
      {data.map((ad) => (
        <Col xs={6} md={6} lg={2} key={ad.ad_id} className="mb-2  p-1 p-lg-2">
          <Card className="h-100">
            <Card.Img
              className="analytics-card-img-top ad-image"
              variant="top"
              src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}
            />
            <Card.Body className="analytics-card-body p-0 mx-2">
            <Card.Title 
                className='mb-0 d-flex justify-content-start' 
                style={{
                  fontSize: '17px',
                  whiteSpace: 'nowrap',        // Keep text on a single line
                  overflow: 'hidden',          // Hide overflow text
                  textOverflow: 'ellipsis',    // Show ellipsis at the end
                  maxWidth: '100%',            // Ensure it fits within the card
                  display: 'block',            // Ensures proper behavior in some cases
                }}
              >
                {ad.ad_title}
            </Card.Title>
              <Card.Text className="analytics-price-container justify-content-start">
                <span className="text-success"><em>Kshs:&nbsp;</em></span>
                <strong style={{ fontSize: '18px' }} className="text-danger">
                  {ad.ad_price.split('.').map((part, index) => (
                    <React.Fragment key={index}>
                      {index === 0 ? (
                        <span className="analytics-price-integer">
                          {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                        </span>
                      ) : (
                        <>
                          <span style={{ fontSize: '10px' }}>.</span>
                          <span className="analytics-price-decimal">
                            {(part || '00').padEnd(2, '0').slice(0, 2)} {/* Ensure two decimal points */}
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </strong>
              </Card.Text>
              <Card.Text className="d-flex justify-content-start">
                <strong>Wishlisted:&nbsp;</strong> {ad.wishlist_count}
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopWishListedAds;
