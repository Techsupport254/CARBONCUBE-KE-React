import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Seller Age Group Chart
const SellerAgeGroupChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            label: "Sellers",
            data: Object.values(data),
            backgroundColor: "#FF9800",
        }],
    };

    const chartOptions = {
        responsive: true,
        scales: { 
            y: { beginAtZero: true } 
        },
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true, // Enables circular markers
                    pointStyle: "circle", // Ensures markers are displayed as circles
                    padding: 10,  // Adjust padding between the label and the chart
                    generateLabels: function(chart) {
                        const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);

                        // Make the color boxes circular
                        labels.forEach(label => {
                            label.pointStyle = 'circle';
                            label.radius = 10; // Adjust the size of the circle
                        });

                        return labels;
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
};


// seller Gender Distribution Chart
const SellerGenderDistributionChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: ["#FF6384", "#36A2EB"],
        }],
    };

    const chartOptions = {
        cutout: '70%',  // Adjust the size of the hole in the middle
        plugins: {
            legend: {
                display: false,  // Hide default legend
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={chartData} options={chartOptions} style={{ width: '200px', height: '200px' }} />
            </div>

            {/* Custom Legend */}
            <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {Object.keys(data).map((gender, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                        <div 
                            style={{
                                width: '15px',
                                height: '15px',
                                backgroundColor: chartData.datasets[0].backgroundColor[index],
                                marginRight: '5px',
                                borderRadius: '50%',  // Makes it a circle
                            }}
                        />
                        <span style={{ fontSize: '12px' }}>{gender}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


//Seller Category Chart
const SellerCategoryChart = ({ data }) => {
    const chartData = {
        labels: data.map(s => Object.entries(s)[0][0]),
        datasets: [{
            label: "Sellers",
            data: data.map(s => Object.entries(s)[0][1]),
            backgroundColor: "#FF9800",
        }],
    };
    
    const chartOptions = {
        responsive: true,
        scales: { 
            y: { beginAtZero: true } 
        },
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true, // Enables circular markers
                    pointStyle: "circle", // Ensures markers are displayed as circles
                    padding: 10, // Adjusts spacing between legend items
                    generateLabels: function(chart) {
                        const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);
    
                        labels.forEach(label => {
                            label.pointStyle = "circle"; // Forces all labels to be circular
                        });
    
                        return labels;
                    },
                },
            },
        },
    };
    
    return <Bar data={chartData} options={chartOptions} />;
};


// Seller Tier Chart
const SellerTierChart = ({ data }) => {
    // Extract tier names and totals correctly
    const tierNames = data.map(obj => Object.keys(obj)[0]);  // ["Free", "Basic", "Standard", "Premium"]
    const tierTotals = data.map(obj => Object.values(obj)[0]);  // [15, 14, 12, 9]

    const chartData = {
        labels: tierNames,
        datasets: [{
            data: tierTotals,
            backgroundColor: ["#3F51B5", '#919191', '#FF9800', '#363636'],
        }],
    };

    const chartOptions = {
        cutout: '70%',
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={chartData} options={chartOptions} style={{ width: '200px', height: '200px' }} />
            </div>

            {/* Custom Legend */}
            <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {tierNames.map((tier, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                        <div 
                            style={{
                                width: '15px',
                                height: '15px',
                                backgroundColor: chartData.datasets[0].backgroundColor[index],
                                marginRight: '5px',
                                borderRadius: '50%',
                            }}
                        />
                        <span style={{ fontSize: '12px' }}>{tier}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};



export { SellerAgeGroupChart, SellerGenderDistributionChart, SellerCategoryChart, SellerTierChart };