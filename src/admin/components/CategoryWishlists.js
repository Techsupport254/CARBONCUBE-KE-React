import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

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
            <span className="font-bold text-red-600 text-sm">{category.total_wishlists} Wishlists</span>
          </div>
          <div>
            <span className="font-bold text-blue-600 text-sm">{category.wishlist_percentage} %</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryWishlists;
