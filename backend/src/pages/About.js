import React from 'react';
import styled from 'styled-components';
import devImage from '../assets/dev.png'; // Import the developer's image

const About = () => {
  return (
    <Container>
      <Content>
        <ImageContainer>
          <ProfileImage src={devImage} alt="Developer" />
        </ImageContainer>
        <TextContainer>
          <Title>About the Developer</Title>
          <Paragraph>
            Hi, I'm Muhammad Hunain, the developer behind this website. I have a passion for creating user-friendly and
            efficient web applications. This platform is a culmination of my skills in web development and my love for books.
          </Paragraph>
          <LinkedInButton href="https://linkedin.com/in/muhammad-hunain-a7a312246" target="_blank">
            <LinkedInIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
              <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46C0 23.21.79 24 1.77 24h20.46c.98 0 1.77-.79 1.77-1.77V1.77C24 .79 23.21 0 22.23 0zM7.12 20.54H3.56V9h3.56v11.54zM5.34 7.65c-1.14 0-2.07-.93-2.07-2.07S4.2 3.51 5.34 3.51s2.07.93 2.07 2.07-1.02 2.07-2.07 2.07zm15.2 12.89h-3.56v-5.72c0-1.36-.03-3.12-1.9-3.12-1.91 0-2.2 1.49-2.2 3.03v5.81h-3.56V9h3.42v1.57h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.49v6.32h-.01z"/>
            </LinkedInIcon>
            Connect with me on LinkedIn
          </LinkedInButton>
          <Title>About the Website</Title>
          <Paragraph>
            This website serves as a digital library where users can explore and download books in various genres. It's
            designed to be a resourceful and engaging platform for book enthusiasts. Whether you're looking for classic
            literature or modern novels, our collection aims to cater to diverse tastes and preferences.
          </Paragraph>
        </TextContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #333;
  color: #fff;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 90%; /* Adjust to 90% width */
  background-color: #444;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #555;
`;

const ProfileImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
`;

const TextContainer = styled.div`
  flex: 2;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d4af37;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 1.5rem;
`;

const LinkedInButton = styled.a`
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0077b5;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005582;
  }
`;

const LinkedInIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

export default About;
