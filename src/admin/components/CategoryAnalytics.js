import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
import 'chart.js/auto';
import './CategoryAnalytics.css'; // Ensure this file contains your CSS

const CategoryAnalytics = ({ data = [] }) => { // Default empty array
  if (!data || data.length === 0) {
    return <div className="text-center">Loading category analytics...</div>;
  }

  const totalAds = data.reduce((sum, category) => sum + (category.total_ads || 0), 0);

  const chartData = (category) => {
    const percentageAds = totalAds > 0 ? ((category.total_ads / totalAds) * 100).toFixed(2) : 0;
    return {
      labels: [category.category_name, 'Other Ads'],
      datasets: [
        {
          data: [percentageAds, (100 - percentageAds).toFixed(2)],
          backgroundColor: ['#FF9800', '#DDDDDD'],
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
            <div className="ad-info">
              <span><strong className="text-danger">{category.total_ads} Ads</strong></span>
            </div>
            <div className="percentage-info">
              <span><strong className="text-primary">{((category.total_ads / totalAds) * 100).toFixed(2)} %</strong></span>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryAnalytics;
