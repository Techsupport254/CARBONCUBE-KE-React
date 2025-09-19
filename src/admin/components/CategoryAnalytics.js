import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((category, index) => (
        <div key={index} className="text-center">
          <div className="h-24 w-24 mx-auto mb-2">
            <Doughnut data={chartData(category)} options={chartOptions} />
          </div>
          <div className="mb-1">
            <p className="font-bold text-sm">{category.category_name}</p>
          </div>
          <div className="mb-1">
            <span className="font-bold text-red-600 text-sm">{category.total_ads} Ads</span>
          </div>
          <div>
            <span className="font-bold text-blue-600 text-sm">{((category.total_ads / totalAds) * 100).toFixed(2)} %</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryAnalytics;
