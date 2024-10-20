import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import QuoteSlider from './QuoteSlider';

const HeroSection = ({ isLoggedIn }) => {
  const role = localStorage.getItem('role'); // Retrieve the user's role from localStorage

  return (
    <Hero>
      <HeroContent>
        <h1>Welcome to <LogoText>کتاب گھر</LogoText></h1>
        <p>Explore our diverse collection of literary treasures online.</p>
        {isLoggedIn ? (
          role === 'admin' ? (
            <StyledLink to="/admin-dashboard">Continue to Admin Dashboard</StyledLink>
          ) : (
            <StyledLink to="/dashboard">Continue to Dashboard</StyledLink>
          )
        ) : (
          <StyledLink to="/login">Discover More</StyledLink>
        )}
        <QuoteSlider />
      </HeroContent>
    </Hero>
  );
};

const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  background: ${({ theme }) => theme.colors.heroBackground} url('/mnt/data/image.png') center/cover no-repeat;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  padding: 2rem;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box; /* Ensures padding is included in total width/height */

  @media (max-width: 768px) {
    padding: 1rem;
    height: auto; /* Adjust height for better content fitting */
  }
`;

const HeroContent = styled.div`
  max-width: 90%;
  width: 100%;
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const LogoText = styled.span`
  font-family: 'Scheherazade New', serif;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.secondary};

  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust logo text size on smaller screens */
  }
`;

const StyledLink = styled(Link)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  display: inline-block;
  margin-bottom: 2rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark}; /* Assuming a darker shade for hover effect */
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

export default HeroSection;
