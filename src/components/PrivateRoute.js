import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoute = ({ isAuthenticated, role, userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userRole !== role) {
      alert("You need to be logged in with the correct role to access this page.");
      navigate('/login');
    }
  }, [isAuthenticated, role, userRole, navigate]);

  return isAuthenticated && userRole === role ? <Outlet /> : null;
};

export default PrivateRoute;
