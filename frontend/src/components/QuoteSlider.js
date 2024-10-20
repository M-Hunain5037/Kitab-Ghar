import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const QuoteSlider = () => {
  return (
    <SliderContainer>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true, el: '.swiper-pagination' }}
        modules={[Autoplay, Pagination]}
      >
        <SwiperSlide>
          <Quote>"Knowledge is power."</Quote>
        </SwiperSlide>
        <SwiperSlide>
          <Quote>"A book is a dream you hold in your hands."</Quote>
        </SwiperSlide>
        <SwiperSlide>
          <Quote>"Reading is to the mind what exercise is to the body."</Quote>
        </SwiperSlide>
        <SwiperSlide>
          <Quote>"The more that you read, the more things you will know. The more that you learn, the more places you'll go."</Quote>
        </SwiperSlide>
        <SwiperSlide>
          <Quote>"There is no friend as loyal as a book."</Quote>
        </SwiperSlide>
      </Swiper>
      <div className="swiper-pagination"></div>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 2rem auto;
  padding: -1rem;
  background: rgba(255, 255, 255, 0.9); /* Slightly more opaque white background */
  border-radius: 20px; /* More rounded corners */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Deeper shadow for a more elevated look */
  position: relative;

  .swiper-pagination {
    position: absolute;
    bottom: -20px; /* Adjusted positioning */
    left: 0;
    width: 100%;
    text-align: center;
  }

  .swiper-pagination-bullet {
    background: #d4af37; /* Gold */
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .swiper-pagination-bullet-active {
    background: #1e2a38; /* Dark Blue */
    opacity: 1;
  }
`;

const Quote = styled.p`
  font-size: 1.5rem;
  color: #1e2a38; /* Dark Blue */
  text-align: center;
  font-family: 'Georgia', serif;
  margin: 0;
  padding: 1rem;
  opacity: 0;
  transition: opacity 1s ease-in-out;

  .swiper-slide-active & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem; /* Adjust font size for small screens */
    padding: 0.5rem;
  }
`;

export default QuoteSlider;
