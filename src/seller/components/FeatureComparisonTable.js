import React from "react";
import { Container, OverlayTrigger, Tooltip } from "react-bootstrap";

const FeatureComparisonTable = () => {
  const features = [
    { name: "Dedicated technical support", free: true, basic: true, standard: true, premium: true },
    { name: "Improved listing visibility", basic: true, standard: true, premium: true },
    { name: "Marketplace analytics access", basic: true, standard: true, premium: true },
    { name: "Ability to create discount offers", basic: "limited", standard: true, premium: true },
    { name: "Priority listing in category searches", standard: true, premium: true },
    { name: "Featured listing options", premium: true },
    { name: "Advanced promotional tools (e.g., banner ads)", premium: true },
    { name: "Access to wishlist & competitor statistics", premium: true },
    { name: "Ability to post product videos", premium: true },
    { name: "Inclusive of physical verification", premium: true },
  ];

  const renderIcon = (value) => {
    if (value === true) 
      return <span className="text-success" style={{ fontSize: "18px" }}>✔</span>;
    if (value === "limited") 
      return (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-limited">Limited access in Basic tier</Tooltip>}
        >
          <span className="text-warning" style={{ fontSize: "18px", cursor: "help" }}>✔*</span>
        </OverlayTrigger>
      );
    return <span className="text-danger" style={{ fontSize: "18px" }}>✘</span>;
  };

  return (
    <section className="pricing-comparison my-5">
      <Container>
        <h2 className="text-center mb-4">Features Comparison</h2>
        <div className="table-responsive">
          <table className="table table-bordered comparison-table">
            <thead className="table-light text-center">
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Basic</th>
                <th>Standard</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td>{feature.name}</td>
                  <td className="text-center">{renderIcon(feature.free)}</td>
                  <td className="text-center">{renderIcon(feature.basic)}</td>
                  <td className="text-center">{renderIcon(feature.standard)}</td>
                  <td className="text-center">{renderIcon(feature.premium)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
};

export default FeatureComparisonTable;
