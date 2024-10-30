import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './TopSellingProducts.css';

const TopSellingProducts = ({ data }) => {
  return (
    <Row>
      {data.map((product) => (
        <Col xs={12} md={6} lg={4} key={product.product_id} className="mb-1 mb-lg-2">
          <Card className="h-100">
            <Card.Img
              className="product-image"
              variant="top"
              src={product.media && product.media.length > 0 ? product.media[0] : 'default-image-url'}
            />
            <Card.Body className="analytics-card-body p-0 mx-2">
              <Card.Title className='d-flex justify-content-start mb-0 mb-lg-1' style={{ fontSize: '17px' }}>{product.product_title}</Card.Title>
              <Card.Text className="analytics-price-container justify-content-start">
                <em className="text-success" style={{ fontSize: '12px' }}>Kshs: </em>
                <strong style={{ fontSize: '18px' }} className="text-danger">
                  {product.product_price.split('.').map((part, index) => (
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
                <strong>Sold:&nbsp;</strong> {product.total_sold}
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopSellingProducts;
