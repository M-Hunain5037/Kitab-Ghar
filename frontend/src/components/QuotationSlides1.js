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
          <QuoteBox key={index}>{quote}</QuoteBox>
        ))}
      </Slider>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  margin: 1rem 0;
  background-color: #222;
  padding: 1rem;
  border-radius: 5px;
`;

const QuoteBox = styled.div`
  padding: 1rem;
  text-align: center;
  font-style: italic;
  color: #d4af37; // Use a color that contrasts well with the background
`;

export default QuotationSlides;
