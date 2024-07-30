import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Load API base URL from environment variable

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id, API_BASE_URL]);

  if (!book) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <DetailsContainer>
      <CoverSection>
        <CoverImage src={book.cover_image_url} alt={book.title} />
      </CoverSection>
      <InfoSection>
        <Title>{book.title}</Title>
        <Author>by {book.authors}</Author>
        <Description>{book.description}</Description>
        <Genres>
          {book.genres.split(',').map((genre) => (
            <Genre key={genre}>{genre}</Genre>
          ))}
        </Genres>
        <Tags>
          {book.tags.split(',').map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
        <Button onClick={() => window.open(book.book_file_url, '_blank')}>
          Downlode PDF
        </Button>
      </InfoSection>
    </DetailsContainer>
  );
};

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #333;
  color: #fff;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const CoverSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const CoverImage = styled.img`
  max-width: 100%;
  max-height: 600px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  object-fit: cover;
`;

const InfoSection = styled.div`
  flex: 2;
  padding: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
    padding: 1rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d4af37;
`;

const Author = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ccc;
  font-style: italic;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #ddd;
`;

const Genres = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Genre = styled.span`
  background-color: #555;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #fff;
`;

const Tags = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background-color: #444;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #fff;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #d4af37;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: #b89930;
  }
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #ddd;
  text-align: center;
  margin-top: 2rem;
`;

export default BookDetails;
