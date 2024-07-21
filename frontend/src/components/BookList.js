import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const booksPerPage = 8;
  const pagesVisited = pageNumber * booksPerPage;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books/approved', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const displayBooks = books.slice(pagesVisited, pagesVisited + booksPerPage).map((book) => (
    <BookBox key={book.id}>
      <CoverImage src={`http://localhost:5000${book.cover_image_url}`} alt={book.title} />
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
    <BookContainer>
      {displayBooks}
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
    </BookContainer>
  );
};

const BookContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
  background-color: #333;
`;

const BookBox = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 400px;
`;

const CoverImage = styled.img`
  max-height: 200px;
  margin-bottom: 1rem;
  object-fit: cover;
  width: 100%;
  height: auto;
  border-radius: 5px;
`;

const BookDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #333;
`;

const Author = styled.p`
  font-size: 1rem;
  color: #777;
`;

const ReadMoreButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  .paginationBttns {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .paginationBttns a {
    margin: 0 0.25rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    color: #FFD700;
    cursor: pointer;
  }

  .paginationBttns .paginationActive a {
    background-color: #FFD700;
    color: black;
  }

  .paginationBttns .paginationDisabled a {
    color: #ddd;
  }
`;

export default BookList;
