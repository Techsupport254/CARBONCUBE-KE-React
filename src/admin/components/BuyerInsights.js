import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import './BuyerInsights.css'; // Import the CSS files

const BuyerInsights = () => {
  const [selectedMetric, setSelectedMetric] = useState('Total Wishlists');
  const [buyersData, setBuyersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    fetchBuyersData(metric);
  };

  const fetchBuyersData = (metric) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics?metric=${metric}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBuyersData(data.buyers_insights || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching buyer insights:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBuyersData(selectedMetric);
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
              <th>Buyer Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option>Total Wishlists</option>
                  <option>Total Click Events</option>
                </Form.Control>
              </th>
            </tr>
          </thead>
          <tbody>
            {buyersData.map((buyer, index) => (
              <tr key={buyer.buyer_id || index}>
                <td>{index + 1}</td>
                <td>{buyer.fullname}</td>
                <td>
                  {selectedMetric === 'Total Wishlists' && (
                    <strong className=" text-success fw-bold">{buyer.total_wishlists}</strong>
                  )}
                  {selectedMetric === 'Total Click Events' && (
                    <>
                      <strong style={{ fontSize: '16px' }} className="text-success">
                        {buyer.total_clicks || 0}{}
                      </strong>
                    </>
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

export default BuyerInsights;

