import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearchChange(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = debounce(async (query) => {
    if (query.length > 0) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/search?title=${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSuggestions(response.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleSearchSelect = (id) => {
    navigate(`/books/${id}`);
    setSuggestions([]);
  };

  const handleFilterClick = () => {
    navigate('/filter');
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search by Book Title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((book) => (
            <SuggestionItem key={book.id} onClick={() => handleSearchSelect(book.id)}>
              <SuggestionImage
                src={book.cover_image_url}
                alt={book.title}
                onError={(e) => (e.target.src = 'path/to/default/image.jpg')}
              />
              <SuggestionTitle>{book.title}</SuggestionTitle>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      <ButtonContainer>
        <UploadButton onClick={handleUploadClick}>Upload Book</UploadButton>
        <FilterButton onClick={handleFilterClick}>Filter</FilterButton>
      </ButtonContainer>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  margin: 0 auto;
  background-color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem;
    width: 95%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 5%;
  width: 90%;
  max-width: 600px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 5px;

  @media (max-width: 768px) {
    left: 0;
    width: 100%;
  }
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.25rem;
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 30px;
    height: 45px;
    margin-right: 0.5rem;
  }
`;

const SuggestionTitle = styled.span`
  font-size: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #d4af37;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  width: 200px;

  &:hover {
    background-color: #b68b2d;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.875rem;
    width: 100%;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #d4af37;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  width: 200px;

  &:hover {
    background-color: #b68b2d;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.875rem;
    width: 100%;
  }
`;

export default SearchBar;
