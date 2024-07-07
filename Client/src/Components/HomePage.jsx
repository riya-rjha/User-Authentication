import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <h2>Welcome to MyApp!</h2>
      <div className="home-links">
        <Link to="/auth/register">Register</Link>
        <Link to="/auth/login">Login</Link>
      </div>
    </div>
  );
};

export default HomePage;
