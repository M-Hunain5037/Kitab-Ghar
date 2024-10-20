import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';
import NotificationIcon from './NotificationIcon'; // Ensure this component exists and functions independently

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const isAdmin = localStorage.getItem('role') === 'admin';
  const userId = localStorage.getItem('userId');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Nav>
      <Logo>کتاب گھر</Logo>
      <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </Hamburger>
      <NavLinks isOpen={isMenuOpen}>
        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
        {isLoggedIn && <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>}
        {isLoggedIn ? (
          <>
            {isAdmin && <NavLink to="/admin-dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</NavLink>}
            <NotificationIcon userId={userId}>
              Notifications
            </NotificationIcon>
            <Button onClick={handleLogout}>Signout</Button>
          </>
        ) : (
          <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Signup/Login</NavLink>
        )}
      </NavLinks>
      {isMenuOpen && <Overlay onClick={() => setIsMenuOpen(false)} />}
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  position: relative;
`;

const Logo = styled.h1`
  font-family: 'Scheherazade New', serif;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1rem;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    z-index: 1001; /* Ensure the panel is above the overlay */
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.textLight};
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0.5rem 0;
    width: 100%;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 0.5rem 1.5rem; /* Adjusted padding for better size */
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease-in-out;
  margin-left: 1rem;
  border-radius: 4px; /* Added border radius for a smoother look */

  &:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }

  @media (max-width: 768px) {
    width: calc(100% - 2rem); /* Full width minus padding */
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px); /* Add blur effect */
  z-index: 1000; /* Ensure the overlay is above other content but below the side panel */
`;

export default Navbar;
