import React from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';

import BookList from '../components/BookList';
import QuotationSlides from '../components/QuotationSlides1';

const Dashboard = () => {
  const handleSearch = (query) => {
    // Implement search functionality here
    console.log('Search query:', query);
  };

  return (
    <Container>
      <MainContent>
        
        <QuotationSlides />
        <SearchBar onSearch={handleSearch} />
        <Content>

          <BookList />
        </Content>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

export default Dashboard;
