import React from 'react';  
import CompetitorAds from './CompetitorAds'; 
// import { Row, Col } from 'react-bootstrap';

const CompetitorStats = ({ data }) => {
    if (!data) return <div>No competitor stats available</div>;

    const {  top_competitor_ads, competitor_average_price } = data;

    return (
        <div className="container mt-2 px-0">            
            <div className="card shadow-sm mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none' }}>
                <div className="card-body py-2 px-3">
                    <h5 className="card-title">Top Competitor Ads</h5>
                    <CompetitorAds data={Array.isArray(top_competitor_ads) ? top_competitor_ads : []} />
                </div>
            </div>

            <div 
                className="card shadow-sm mb-2" 
                style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    border: 'none', 
                    borderRadius: '12px', 
                    padding: '15px', 
                    backdropFilter: 'blur(10px)', 
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div className="card-body py-2 px-3">
                    
                    <p 
                        className="card-text"
                        style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}
                    >
                        <strong>Competitor Average Price:</strong> 
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                            &nbsp; Kshs &nbsp;
                        </span>
                        <strong style={{ fontSize: '18px', color: '#dc3545' }}>
                            {(competitor_average_price ?? 0).toFixed(2).split('.').map((part, index) => (
                                <React.Fragment key={index}>
                                    {index === 0 ? (
                                        <span className="analytics-price-integer">
                                            {parseInt(part, 10).toLocaleString()} {/* Format integer with commas */}
                                        </span>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '10px' }}>.</span>
                                            <span className="analytics-price-decimal">
                                                {(part || '00').padEnd(2, '0').slice(0, 2)} {/* Ensure two decimal points */}
                                            </span>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompetitorStats;
