// src/components/Layout.js
import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header'; // Import Header component

const Layout = ({ children, isLoggedIn, handleLogout }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> {/* Pass isLoggedIn and handleLogout as props */}
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;