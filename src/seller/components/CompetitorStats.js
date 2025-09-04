import React from 'react';  
import CompetitorAds from './CompetitorAds'; 

const CompetitorStats = ({ data }) => {
    if (!data) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📊</div>
                <p className="text-gray-500">No competitor stats available</p>
            </div>
        );
    }

    const { top_competitor_ads, competitor_average_price } = data;

    return (
        <div className="space-y-4">            
            <div className="bg-white bg-opacity-20 rounded-lg shadow-sm border border-gray-100">
                <div className="p-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Top Competitor Ads</h5>
                    <CompetitorAds data={Array.isArray(top_competitor_ads) ? top_competitor_ads : []} />
                </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg shadow-sm border border-gray-100 p-4">
                <p className="text-gray-800 font-medium">
                    <strong>Competitor Average Price:</strong> 
                    <span className="text-green-600 font-bold ml-2">
                        Kshs
                    </span>
                    <span className="text-red-600 font-bold text-lg ml-2">
                        {(competitor_average_price ?? 0).toFixed(2).split('.').map((part, index) => (
                            <React.Fragment key={index}>
                                {index === 0 ? (
                                    <span className="analytics-price-integer">
                                        {parseInt(part, 10).toLocaleString()} {/* Format integer with commas */}
                                    </span>
                                ) : (
                                    <>
                                        <span className="text-xs">.</span>
                                        <span className="analytics-price-decimal">
                                            {(part || '00').padEnd(2, '0').slice(0, 2)} {/* Ensure two decimal points */}
                                        </span>
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default CompetitorStats;
