import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
import 'chart.js/auto';
import './CategoryAnalytics.css'; // Ensure this file contains your CSS

const CategoryWishlists = ({ data = [] }) => { // Default empty array
  if (!data || data.length === 0) {
    return <div className="text-center">Loading category analytics...</div>;
  }

  const totalWishlists = data.reduce((sum, category) => sum + (category.total_wishlists || 0), 0);

  const chartData = (category) => {
    const percentageWishlists = totalWishlists > 0 ? ((category.total_wishlists / totalWishlists) * 100).toFixed(2) : 0;
    return {
      labels: [category.category_name, 'Other Wishlists'],
      datasets: [
        {
          data: [percentageWishlists, (100 - percentageWishlists).toFixed(2)],
          backgroundColor: ['#FF9800', '#DDDDDD'],
          hoverBackgroundColor: ['#0019ff', '#DDDDDD'],
        },
      ],
    };
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Row>
      {data.map((category, index) => (
        <Col xs={6} md={4} lg={3} className="mb-4" key={index}>
          <div className="category-analytics text-center">
            <div className="chart-container">
              <Doughnut data={chartData(category)} options={chartOptions} />
            </div>
            <div className="category-info mt-2">
              <p><strong>{category.category_name}</strong></p>
            </div>
            <div className="wishlist-info">
              <span><strong className="text-danger">{category.total_wishlists} Wishlists</strong></span>
            </div>
            <div className="percentage-info">
              <span><strong className="text-primary">{category.wishlist_percentage} %</strong></span>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryWishlists;
