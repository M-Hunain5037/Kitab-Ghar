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
        <SwiperSlide>"Knowledge is power."</SwiperSlide>
        <SwiperSlide>"A book is a dream you hold in your hands."</SwiperSlide>
        <SwiperSlide>"Reading is to the mind what exercise is to the body."</SwiperSlide>
      </Swiper>
      <div className="swiper-pagination"></div>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);  /* Semi-transparent white background */
  border-radius: 10px;  /* Rounded corners */
  position: relative;

  .swiper-slide {
    font-size: 1.5rem;
    color: #1E2A38;  /* Dark Blue */
    text-align: center;
  }

  .swiper-pagination {
    position: absolute;
    bottom: -30px;  /* Move pagination below the slider */
    left: 0;
    width: 100%;
    text-align: center;
  }

  .swiper-pagination-bullet {
    background: #FFD700;  /* Gold */
  }

  .swiper-pagination-bullet-active {
    background: #1E2A38;  /* Dark Blue */
  }
`;

export default QuoteSlider;
