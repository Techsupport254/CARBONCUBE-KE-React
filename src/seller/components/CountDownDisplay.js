import React, { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';

const CountDownDisplay = () => {
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTotalDays = ({ months = 0, weeks = 0, days = 0 }) => {
    return (months * 30) + (weeks * 7) + days;
  };

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const sellerId = decodedToken.user_id;

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/seller/seller_tiers/${sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch countdown');
        }

        const data = await response.json();

        if (data.subscription_countdown) {
          const totalDays = getTotalDays(data.subscription_countdown);
          setDaysLeft(totalDays);
        } else {
          throw new Error('No countdown data available');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountdown();
  }, []);

  // Optional: reduce 1 day per 24 hours (or test faster with 10 sec below)
  useEffect(() => {
    if (daysLeft > 0) {
      const timer = setInterval(() => {
        setDaysLeft(prev => {
          const next = prev - 1;
          if (next <= 0) clearInterval(timer);
          return next;
        });
      }, 24 * 60 * 60 * 1000); // 1 day in ms (use 10000 for testing)

      return () => clearInterval(timer);
    }
  }, [daysLeft]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (daysLeft <= 0) return <strong>Subscription expired</strong>;

  return (
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#000000' }}>
      {daysLeft} <span style={{ fontSize: '1rem' }}><em>Days Left</em></span>
    </div>
  );
};

export default CountDownDisplay;
