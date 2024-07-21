// SearchBar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

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
        const response = await axios.get(`http://localhost:5000/api/books/search?title=${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSuggestions(response.data.slice(0, 5)); // Show top 5 suggestions
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
              <SuggestionImage src={`http://localhost:5000${book.cover_image_url}`} alt={book.title} />
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
  background-color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 60%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 20%;
  width: 60%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 5px;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  margin-right: 1rem;
`;

const SuggestionTitle = styled.span`
  font-size: 1rem;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #FFC700;
  }
`;

export default SearchBar;
