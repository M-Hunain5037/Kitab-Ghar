import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const RecommendedBooks = () => {
  return (
    <Section>
      <h2>Recommended Books</h2>
      <BooksContainer>
        <Swiper
          spaceBetween={5}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          <SwiperSlide>
            <Book>
              <Box>Book 1</Box>
              <p>Book Title 1</p>
            </Book>
          </SwiperSlide>
          <SwiperSlide>
            <Book>
              <Box>Book 2</Box>
              <p>Book Title 2</p>
            </Book>
          </SwiperSlide>
          <SwiperSlide>
            <Book>
              <Box>Book 3</Box>
              <p>Book Title 3</p>
            </Book>
          </SwiperSlide>
          <SwiperSlide>
            <Book>
              <Box>Book 4</Box>
              <p>Book Title 4</p>
            </Book>
          </SwiperSlide>
        </Swiper>
      </BooksContainer>
    </Section>
  );
};

const Section = styled.section`
  padding: 2rem;
  background: #f5f5f5;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #002147;
  }
`;

const BooksContainer = styled.div`
  .swiper-container {
    padding: 1rem 0;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #002147;
  }

  .swiper-pagination-bullet {
    background: #d4af37;
  }
`;

const Book = styled.div`
  text-align: center;
  padding: 1rem;

  p {
    margin-top: 0.5rem;
    color: #002147;
  }
`;

const Box = styled.div`
  width: 150px;
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #002147;
  font-weight: bold;
`;

export default RecommendedBooks;
