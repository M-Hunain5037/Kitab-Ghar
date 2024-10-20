// Footer.js
import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Text>&copy; 2024 کتاب گھر. All rights reserved.</Text>
        <Text>Designed and Developed by Muhammad Hunain</Text>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #1c1c1c;
  color: #fff;
  text-align: center;
  padding: 20px 0;
  position: relative; /* Changed to relative or remove entirely */
  bottom: 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
`;

export default Footer;
