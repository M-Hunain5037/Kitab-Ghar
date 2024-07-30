import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import NotificationIcon from './NotificationIcon'; // Import the NotificationIcon component

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const isAdmin = localStorage.getItem('role') === 'admin'; // Check if the user is an admin
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  return (
    <Nav>
      <Logo>کتاب گھر</Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {isLoggedIn ? (
          <>
            {isAdmin && <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>}
            <NotificationContainer>
              <NotificationIcon userId={userId} /> {/* Show notification icon if logged in */}
            </NotificationContainer>
            <Button onClick={handleLogout}>Signout</Button>
          </>
        ) : (
          <NavLink to="/login">Signup/Login</NavLink>
        )}
      </NavLinks>
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
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%; /* Make the NavLinks container full width */
    align-items: flex-start; /* Align items to the start */
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
  }
`;

const NotificationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem; /* Ensure some space between the notification icon and the button */
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease-in-out;
  margin-left: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1.25rem;
  }
`;

export default Navbar;
