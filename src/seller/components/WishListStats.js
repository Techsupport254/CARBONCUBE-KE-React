import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WishListStats = ({ data }) => {
    if (!data) return <div className="alert alert-warning">No wishlist stats available</div>;

    const { wishlist_trends = [] } = data;

    // Ensure we are only showing the last 5 months
    const latestTrends = wishlist_trends.slice(0, 5);

    // Get the maximum wishlist count for setting the y-axis max value
    const maxWishlistCount = Math.max(...latestTrends.map(trend => trend.wishlist_count), 0);

    // Prepare data for the Bar chart
    const chartData = {
        labels: latestTrends.map(trend => trend.month), // X-axis labels (months)
        datasets: [
            {
                label: 'Wish List Count',
                data: latestTrends.map(trend => trend.wishlist_count), // Y-axis values (wishlist count)
                backgroundColor: '#FF9800', // Bar color
                borderColor: '#FF9800', // Border color
                borderWidth: 1,
            }
        ]
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
                callbacks: {
                    label: (tooltipItem) => `Wish List Count: ${tooltipItem.raw}`,
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: Math.ceil(maxWishlistCount / 10) * 10,
                ticks: { stepSize: 10 },
            }
        }
    };
    

    return (
        <div className="container mt-0 px-0">
            {/* Wishlist Trends Chart */}
            <div className="card-body px-2">
                <h5 className="card-title">Wish List Trends (Last 5 Months)</h5>
                <div>
                    {Array.isArray(latestTrends) && latestTrends.length > 0 ? (
                        <Bar data={chartData} options={options} />
                    ) : (
                        <div>No trends available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishListStats;
