import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <DetailsContainer>
      <CoverSection>
        <CoverImage src={`http://localhost:5000${book.cover_image_url}`} alt={book.title} />
      </CoverSection>
      <InfoSection>
        <Title>{book.title}</Title>
        <Author>{book.authors}</Author>
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
        <Button onClick={() => window.open(`http://localhost:5000${book.book_file_url}`, '_blank')}>
          Preview PDF
        </Button>
      </InfoSection>
    </DetailsContainer>
  );
};

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2rem;
  background-color: #333;
  color: #fff;
`;

const CoverSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const CoverImage = styled.img`
  max-width: 100%;
  max-height: 600px;
  border-radius: 5px;
`;

const InfoSection = styled.div`
  flex: 2;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #FFD700;
`;

const Author = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ccc;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #ddd;
`;

const Genres = styled.div`
  margin-bottom: 1rem;
`;

const Genre = styled.span`
  background-color: #555;
  padding: 0.5rem;
  border-radius: 5px;
  margin-right: 0.5rem;
  font-size: 0.875rem;
  color: #fff;
`;

const Tags = styled.div`
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: #444;
  padding: 0.5rem;
  border-radius: 5px;
  margin-right: 0.5rem;
  font-size: 0.875rem;
  color: #fff;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

export default BookDetails;
