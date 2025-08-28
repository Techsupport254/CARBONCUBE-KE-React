import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ClickEventsStats = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  // Extracting labels (months) and values
  const labels = data.map((item) => item.month); // Already reversed from backend

  const eventTypes = ["ad_clicks", "add_to_wish_list", "reveal_vendor_details"];
  const colors = ["#919191", "#FF9800", "#363636"]; // Ad Clicks (Gray), Wishlist (Yellow), Reveal Seller (Black)

  const datasets = eventTypes.map((eventType, index) => ({
    label: eventType.replace("_", " ").toUpperCase(),
    backgroundColor: colors[index],
    data: data.map((item) => item[eventType]),
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
        labels: {
          usePointStyle: true, // Ensures circular legend markers
          pointStyle: "circle", // Explicitly sets them to circles
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  

  return (
    <div>
      <h4>Click Event Trends</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ClickEventsStats;