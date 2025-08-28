import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BuyerWishlistStats = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  // Categories (age group, income range, education level, etc.)
  const categories = Object.keys(data);
  
  // Labels for chart
  const labels = categories.map((category) =>
    category.replace("top_", "").replace("_", " ").toUpperCase()
  );

  // The event types for the chart (this would be the "wishlists" data we're displaying)
  const eventTypes = ["wishlists"];
  
  // Colors for different data points
  const colors = ["#FF9800"];

  // Datasets for the Bar Chart
  const datasets = eventTypes.map((eventType, index) => ({
    label: eventType.toUpperCase(),
    backgroundColor: colors[index],
    data: categories.map((category) => {
      const entry = data[category];
      return entry && entry[eventType] ? entry[eventType] : 0;
    }),

  }));

  // Chart data
  const chartData = {
    labels,
    datasets,
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top",
        labels: { font: { size: 10 } ,
                  usePointStyle: true, // Ensures circular legend markers
                  pointStyle: "circle", // Explicitly sets them to circles
                },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const category = categories[tooltipItem.dataIndex]; 
            const specificData = data[category]; 
            
            return `${specificData.age_group || specificData.income_range || specificData.education_level || specificData.employment_status || specificData.sector} (${specificData.wishlists} wishlists)`;
          },
        },
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          font: {
            size: 10, // Reduce font size for Y-axis labels
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10, // Reduce font size for X-axis labels
          },
        },
      },
    },
  };
  
  

  return (
    <div>
      <h4>Wishlist Insights</h4>
      <Bar data={chartData} options={options} />
      {/* Alternatively, you could display the data in a table if you prefer */}
      {/* <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Wishlists</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td>{category.replace("top_", "").replace("_", " ").toUpperCase()}</td>
              <td>{data[category]?.wishlists || 0}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default BuyerWishlistStats;
