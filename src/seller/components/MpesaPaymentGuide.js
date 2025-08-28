import React from 'react'; 
import { Card } from 'react-bootstrap';

const MpesaPaymentGuide = () => {
    return (
        <Card className="mt-5 shadow-sm border-success bg-dark custom-card">
            <Card.Header className="text-white bg-dark" >
                <h5 className="mb-0 text-warning">📲 How to Pay via M-Pesa Paybill</h5>
            </Card.Header>
            <Card.Body>
                <ol className="ps-3" style={{ lineHeight: '1.7' }}>
                    <li>
                        <strong>Go to M-Pesa:</strong> Open the <em>M-Pesa menu</em> on your phone and select <strong>Lipa na M-Pesa</strong>.
                    </li>
                    <li>
                        <strong>Select Paybill:</strong> Choose <strong>Paybill</strong> as the payment option.
                    </li>
                    <li>
                        <strong>Enter Business Number:</strong> Type in <strong><code className="text-success">4160265</code></strong>.
                    </li>
                    <li>
                        <strong>Enter Account Number:</strong> Use your <strong>Phone Number</strong> (same as used during registration).
                    </li>
                    <li>
                        <strong>Enter Amount:</strong> Input the amount for your selected tier and duration suitable for you. (e.g., KES 500, 1000, etc.).
                    </li>
                    <li>
                        <strong>Enter M-Pesa PIN:</strong> Confirm and complete the payment with your PIN.
                    </li>
                </ol>

                <p className="mt-3 text-success">
                    ✅ Once payment is received, your seller account will be <strong>automatically activated</strong>.
                </p>

                <p className="text-dark">
                    ℹ️ Need help? Email{' '}
                    <a
                        href="mailto:info@carboncube-ke.com"
                        className="text-success"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        info@carboncube-ke.com
                    </a>{' '}
                    or call{' '}
                    <a href="tel:+254712990524" className="text-success">
                        +254 712 990524
                    </a>.
                </p>
            </Card.Body>
        </Card>
    );
};

export default MpesaPaymentGuide;
