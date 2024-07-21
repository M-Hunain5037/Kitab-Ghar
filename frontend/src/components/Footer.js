import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; 2024 کتاب گھر. All rights reserved.</p>
        <FooterLinks>
          <a href="https://facebook.com">Facebook</a>
          <a href="https://twitter.com">Twitter</a>
          <a href="https://instagram.com">Instagram</a>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 1rem;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  p {
    margin: 0;
  }
`;

const FooterLinks = styled.div`
  margin-top: 1rem;
  a {
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0 0.5rem;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Footer;
