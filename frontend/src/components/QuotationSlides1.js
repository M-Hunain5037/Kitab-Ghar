import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const quotes = [
  'The only thing you absolutely have to know is the location of the library. – Albert Einstein',
  'A room without books is like a body without a soul. – Marcus Tullius Cicero',
  'A book is a dream that you hold in your hand. – Neil Gaiman',
  'There is no friend as loyal as a book. – Ernest Hemingway',
  'Books are a uniquely portable magic. – Stephen King',
  'Reading is a discount ticket to everywhere. – Mary Schmich',
  'A book is a gift you can open again and again. – Garrison Keillor',
  'A reader lives a thousand lives before he dies. – George R.R. Martin',
  'Books are the plane, and the train, and the road. They are the destination, and the journey. They are home. – Anna Quindlen',
  'I find television very educational. Every time someone turns it on, I go in the other room and read a book. – Groucho Marx',
  'I cannot live without books. – Thomas Jefferson',
  'Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers. – Charles William Eliot',
  // Add more quotes here
];

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const QuotationSlides = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true, // Vertical sliding
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <SliderContainer>
      <Slider {...settings}>
        {quotes.map((quote, index) => (
          <QuoteBox key={index}>{truncateText(quote, 100)}</QuoteBox>
        ))}
      </Slider>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 80%;
  margin: 2rem auto;
  background-color: #222;
  padding: 1.5rem;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }
`;

const QuoteBox = styled.div`
  padding: 1rem;
  text-align: center;
  font-style: italic;
  color: #d4af37; // Use a color that contrasts well with the background
  font-size: 1.25rem;
  min-height: 100px; // Ensure enough height for longer quotes
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem;
    min-height: 80px; // Adjust for smaller screens
  }
`;

export default QuotationSlides;