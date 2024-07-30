import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; 2024 کتاب گھر. All rights reserved.</p>        
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #1c1c1c;
  color: #fff;
  text-align: center;
  /* Set a fixed height or use padding to control height */
  height: 100px; /* Adjust this value as needed */
  /* padding: 20px 0; */ /* Alternatively, use padding */
  position: fixed; /* If you want it fixed at the bottom */
  bottom: 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
`;


export default Footer;
