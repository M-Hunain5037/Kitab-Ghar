import React from 'react';
import styled from 'styled-components';

const ErrorPage = () => {
  return (
    <Container>
      <Message>You are not authorized to view this page. Please log in.</Message>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff;
`;

const Message = styled.h1`
  color: #000;
`;

export default ErrorPage;
