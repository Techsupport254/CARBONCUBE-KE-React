import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const SellerInsights = () => {
  const [selectedMetric, setSelectedMetric] = useState('Rating');
  const [sellersData, setSellersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    fetchSellersData(metric);
  };

  const fetchSellersData = (metric) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics?metric=${metric}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSellersData(data.sellers_insights || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching seller insights:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellersData(selectedMetric);
  }, [selectedMetric]); // Initial fetch

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Table striped bordered hover className="text-center transparent-table">
          <thead>
            <tr>
              <th>No:</th>
              <th>Seller Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option>Rating</option>
                  <option>Total Ads</option>
                  <option>Reveal Clicks</option>
                  <option>Ad Clicks</option>
                </Form.Control>
              </th>
            </tr>
          </thead>
          <tbody>
            {sellersData.map((seller, index) => (
              <tr key={seller.seller_id || index}>
                <td>{index + 1}</td>
                <td>{seller.fullname}</td>
                <td>
                  {selectedMetric === 'Rating' && (
                    <strong className=" text-success fw-bold">{seller.mean_rating ? parseFloat(seller.mean_rating).toFixed(2) : '0.00'}</strong>
                  )}
                  {selectedMetric === 'Total Ads' && (
                    <>
                      <strong style={{ fontSize: '16px' }} className="text-success">
                        {seller.total_ads}
                      </strong>
                    </>
                  )}
                  {selectedMetric === 'Reveal Clicks' && (
                    <strong className="text-success fw-bold">
                      {seller.reveal_clicks}
                    </strong>
                  )}
                  {selectedMetric === 'Ad Clicks' && (
                    <strong className="text-success fw-bold">
                      {seller.total_ad_clicks}
                    </strong>
                  )}               
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SellerInsights;
