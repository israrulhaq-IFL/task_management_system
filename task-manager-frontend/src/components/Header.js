// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ isLoggedIn, handleLogout }) => {
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
  console.log('User role:', role); // Debugging log

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Task Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/head">Head of Department</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/manager">Manager</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/team">Team Member</Nav.Link>
            {role === 'Super Admin' && (
              <>
              <Nav.Link as={Link} to="/departments">Department Management</Nav.Link>
              <Nav.Link as={Link} to="/sub-departments">Sub-Department Management</Nav.Link>
            </>
            )}
            {isLoggedIn ? (
              <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;