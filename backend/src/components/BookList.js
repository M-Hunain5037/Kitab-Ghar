import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const booksPerPage = 10;
  const pagesVisited = pageNumber * booksPerPage;

  useEffect(() => {
    fetchBooks();
  }, [pageNumber, selectedTags, selectedAuthors, selectedGenres, selectedLanguages]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books/approved`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          tags: selectedTags.join(','),
          authors: selectedAuthors.join(','),
          genres: selectedGenres.join(','),
          languages: selectedLanguages.join(',')
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const displayBooks = books.slice(pagesVisited, pagesVisited + booksPerPage).map((book) => (
    <BookBox key={book.id}>
      <CoverImage src={book.cover_image_url} alt={book.title} />
      <BookDetails>
        <Title>{book.title}</Title>
        <Author>{book.authors}</Author>
        <Link to={`/books/${book.id}`}>
          <ReadMoreButton>Read More</ReadMoreButton>
        </Link>
      </BookDetails>
    </BookBox>
  ));

  const pageCount = Math.ceil(books.length / booksPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Container>
      <PaginationContainer>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </PaginationContainer>
      <BookContainer>
        {displayBooks}
      </BookContainer>
      <PaginationContainer>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </PaginationContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: #333;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  box-sizing: border-box;
`;

const BookContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 90%; /* Adjusted for 90% width */
  padding: 0 1rem;
  margin-top: 2rem;
  justify-items: center;
  box-sizing: border-box;
`;

const BookBox = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  min-height: 300px; /* Reduced height for cards */
  max-height: 400px; /* Set a maximum height */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  }
`;

const CoverImage = styled.img`
  max-width: 100%;
  max-height: 150px; /* Limit the image height */
  height: auto;
  border-radius: 8px;
`;

const BookDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  margin: 0.5rem 0;
  color: #333;
  font-weight: 600;
`;

const Author = styled.p`
  font-size: 1rem;
  color: #555;
`;

const ReadMoreButton = styled.button`
  padding: 0.5rem 1.5rem;
  margin-top: 1rem;
  background-color: #d4af37;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b68b2d;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;

  .paginationBttns {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .paginationBttns a {
    margin: 0 0.25rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    color: #d4af37;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #444;
      color: white;
    }
  }

  .paginationBttns .paginationActive a {
    background-color: #d4af37;
    color: black;
  }

  .paginationBttns .paginationDisabled a {
    color: #ddd;
  }
`;

export default BookList;
