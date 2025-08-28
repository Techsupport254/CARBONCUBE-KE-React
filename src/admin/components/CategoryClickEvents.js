import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
import 'chart.js/auto';
import './CategoryClickEvents.css';

const CategoryClickEvents = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center">Loading category analytics...</div>;
  }

  // Helper to calculate total clicks per category
  const totalClicks = (category) =>
    (category.ad_clicks || 0) + (category.wish_list_clicks || 0) + (category.reveal_clicks || 0);

  // Prepare chart data for each category
  const getChartData = (category) => {
    const total = totalClicks(category);
    return {
      labels: [],
      datasets: [
        {
          data: [
            total > 0 ? ((category.ad_clicks / total) * 100).toFixed(2) : 0,
            total > 0 ? ((category.wish_list_clicks / total) * 100).toFixed(2) : 0,
            total > 0 ? ((category.reveal_clicks / total) * 100).toFixed(2) : 0,
          ],
          backgroundColor: ['#919191', '#FF9800', '#363636'],
        },
      ],
    };
  };

  // Chart config
  const chartOptions = (category) => {
    const total = totalClicks(category);
    return {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const labels = ['Ad Clicks', 'Wish List Clicks', 'Reveal Clicks'];
              const values = [
                category.ad_clicks || 0,
                category.wish_list_clicks || 0,
                category.reveal_clicks || 0,
              ];
              const percentages = values.map((v) =>
                total > 0 ? ((v / total) * 100).toFixed(2) : 0
              );

              return `${labels[index]}: ${values[index]} (${percentages[index]}%)`;
            },
          },
        },
      },
    };
  };

  // Optional: Total reveal clicks across all categories
  const totalRevealClicks = data.reduce(
    (sum, category) => sum + (category.reveal_clicks || 0),
    0
  );

  return (
    <div>
      <Row>
        {data.map((category, index) => (
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={index}>
            <div className="category-analytics text-center">
              <div className="chart-container">
                <Doughnut data={getChartData(category)} options={chartOptions(category)} />
              </div>
              <div className="category-info2 mt-2">
                <p><strong>{category.category_name}</strong></p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Shared Legend */}
      <div className="custom-legend mb-4">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#919191' }}></div>
          <div className="legend-label">Ad Click</div>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
          <div className="legend-label">Wish List</div>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#363636' }}></div>
          <div className="legend-label">Reveal Click</div>
        </div>
      </div>

      {/* Optional: Display total reveal clicks */}
      <div className="text-center mt-3">
        <strong>Total Reveal Clicks Across All Categories: {totalRevealClicks}</strong>
      </div>
    </div>
  );
};

export default CategoryClickEvents;
