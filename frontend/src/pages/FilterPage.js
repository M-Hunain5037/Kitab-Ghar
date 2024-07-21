import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const FilterPage = () => {
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [modalTagSearchTerm, setModalTagSearchTerm] = useState('');
  const [showMoreTagsModal, setShowMoreTagsModal] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem('token');
        const [languagesRes, genresRes, authorsRes, tagsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/languages', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/genres', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/authors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/tags', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setLanguages(processTags(languagesRes.data));
        setGenres(processTags(genresRes.data));
        setAuthors(processTags(authorsRes.data));
        setTags(processTags(tagsRes.data));
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilters();
  }, []);

  const processTags = (tagsArray) => {
    const splitTags = tagsArray.flatMap(tag => tag.split(',').map(t => t.trim()));
    return [...new Set(splitTags)]; // Remove duplicates
  };

  const handleTagSelect = async (tag) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?tag=${tag}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching books by tag:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?tag=${searchTerm}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching books by search term:', error);
    }
  };

  const filterTags = (tagList, term) => {
    if (term === '') return tagList;
    return tagList.filter(tag => tag.toLowerCase().includes(term.toLowerCase()));
  };

  const openMoreTagsModal = () => {
    setShowMoreTagsModal(true);
  };

  const closeMoreTagsModal = () => {
    setShowMoreTagsModal(false);
  };

  return (
    <PageContainer>
      <SearchBar>
        <SearchInput 
          type="text" 
          placeholder="Search tags..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchBar>
      <Content>
        <Sidebar>
          <TagSearchInput 
            type="text" 
            placeholder="Search tags..." 
            value={tagSearchTerm}
            onChange={(e) => setTagSearchTerm(e.target.value)}
          />
          <TagSection>
            <h4>Languages</h4>
            <TagContainer>
              {filterTags(languages, tagSearchTerm).slice(0, 5).map((language, index) => (
                <Tag key={index} onClick={() => handleTagSelect(language)}>{language}</Tag>
              ))}
              {languages.length > 5 && <MoreButton onClick={openMoreTagsModal}>More</MoreButton>}
            </TagContainer>
          </TagSection>
          <TagSection>
            <h4>Genres</h4>
            <TagContainer>
              {filterTags(genres, tagSearchTerm).slice(0, 5).map((genre, index) => (
                <Tag key={index} onClick={() => handleTagSelect(genre)}>{genre}</Tag>
              ))}
              {genres.length > 5 && <MoreButton onClick={openMoreTagsModal}>More</MoreButton>}
            </TagContainer>
          </TagSection>
          <TagSection>
            <h4>Authors</h4>
            <TagContainer>
              {filterTags(authors, tagSearchTerm).slice(0, 5).map((author, index) => (
                <Tag key={index} onClick={() => handleTagSelect(author)}>{author}</Tag>
              ))}
              {authors.length > 5 && <MoreButton onClick={openMoreTagsModal}>More</MoreButton>}
            </TagContainer>
          </TagSection>
          <TagSection>
            <h4>Tags</h4>
            <TagContainer>
              {filterTags(tags, tagSearchTerm).slice(0, 5).map((tag, index) => (
                <Tag key={index} onClick={() => handleTagSelect(tag)}>{tag}</Tag>
              ))}
              {tags.length > 5 && <MoreButton onClick={openMoreTagsModal}>More</MoreButton>}
            </TagContainer>
          </TagSection>
        </Sidebar>
        <BooksContainer>
          {filteredBooks.map(book => (
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
          ))}
        </BooksContainer>
      </Content>
      <Modal
        isOpen={showMoreTagsModal}
        onRequestClose={closeMoreTagsModal}
        contentLabel="More Tags"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '80vh',
            overflow: 'auto',
            backgroundColor: '#333333', // Maintain the existing theme
            color: '#fff',
          },
        }}
      >
        <ModalContent>
          <h4>All Tags</h4>
          <TagSearchInput 
            type="text" 
            placeholder="Search tags..." 
            value={modalTagSearchTerm}
            onChange={(e) => setModalTagSearchTerm(e.target.value)}
          />
          <TagContainer>
            {filterTags([...languages, ...genres, ...authors, ...tags], modalTagSearchTerm).map((tag, index) => (
              <Tag key={index} onClick={() => handleTagSelect(tag)}>{tag}</Tag>
            ))}
          </TagContainer>
          <CloseButton onClick={closeMoreTagsModal}>Close</CloseButton>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333333;
`;

const SearchBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const SearchInput = styled.input`
  width: 40%;
  padding: 0.75rem;
  margin-right: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 300px;
  padding: 1rem;
  background-color: #333;
  color: #fff;
  border-right: 1px solid #ddd;
`;

const TagSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const TagSection = styled.div`
  margin-bottom: 1rem;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  background-color: #007BFF;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const MoreButton = styled.button`
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

const BooksContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #333;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
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

const ModalContent = styled.div`
  padding: 2rem;
  background-color: #333333;
  color: #fff;
  border-radius: 5px;
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

export default FilterPage;
