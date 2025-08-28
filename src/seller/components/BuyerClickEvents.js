import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BuyerClickEvents = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const categories = Object.keys(data);
  
  const labels = categories.map((category) => category.replace("top_", "").replace("_clicks", "").replace("_", " ").toUpperCase());
  const eventTypes = [ "top_wishlist", "top_ad_click", "top_reveal"];
  const colors = ["#FF9800", "#919191",  "#363636"];

  const datasets = eventTypes.map((eventType, index) => ({
    label: eventType.replace("top_", "").replace("_", " ").toUpperCase(),
    backgroundColor: colors[index],
    data: categories.map((category) => data[category]?.[eventType]?.clicks || 0),
  }));

  const chartData = {
    labels,
    datasets,
  };

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
            const eventType = eventTypes[tooltipItem.datasetIndex];  
            const specificData = data[category]?.[eventType];
  
            if (!specificData) return "No data";
  
            const key = Object.keys(specificData).find((k) => k !== "clicks");
            return key ? `${specificData[key]} (${specificData.clicks} clicks)` : `${specificData.clicks} clicks`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } } },
    },
  };

  return (
    <div>
      <h4>Click Events Insights</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BuyerClickEvents;
