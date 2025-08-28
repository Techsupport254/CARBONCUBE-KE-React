import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Box, Envelope, GraphUp, XCircle, ArrowRight, PersonCheck, Union } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default to closed on initial load
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024); // Open by default on larger screens
    };

    // Set initial state based on screen width when component mounts
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Button 
        variant="warning" 
        className={`toggle-button ${isOpen ? 'open' : 'collapsed'}`} 
        onClick={toggleSidebar}
        id="button"
        aria-label="Toggle Sidebar" // Accessibility
      >
        {isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Nav className="flex-column">
          <Nav.Link
            href="/seller/ads"
            className={location.pathname === '/seller/ads' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Ads'}
          </Nav.Link>
          <Nav.Link
            href="/seller/analytics"
            className={location.pathname === '/seller/analytics' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics'}
          </Nav.Link>
          <Nav.Link
            href="/seller/messages"
            className={location.pathname === '/seller/messages' ? 'active' : ''}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/seller/tiers"
            className={location.pathname === '/seller/tiers' ? 'active' : ''}>
            <Union className="icon" /> {isOpen && 'Tiers'}
          </Nav.Link>
          <Nav.Link
            href="/seller/profile"
            className={location.pathname === '/seller/profile' ? 'active' : ''}>
            <PersonCheck className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;