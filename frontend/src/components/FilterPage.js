import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FilterPage = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedModalTags, setSelectedModalTags] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
    fetchBooks();
  }, [selectedTags, searchTerm]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {
        tags: selectedTags.join(','),
        searchTerm
      };

      const url = new URL(`${API_BASE_URL}/api/books`);
      Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
      });

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const [authorsResponse, genresResponse, languagesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/authors`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/genres`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/languages`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const splitAndTrim = (list) => list.flatMap(item => item.split(',').map(tag => tag.trim()));

      setAuthors(splitAndTrim(authorsResponse.data));
      setGenres(splitAndTrim(genresResponse.data));
      setLanguages(splitAndTrim(languagesResponse.data));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(item => item !== tag) : [...selectedTags, tag]);
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleMoreClick = (category, tags) => {
    setModalTitle(category);
    setModalContent(tags);
    setSelectedModalTags(selectedTags.filter(tag => tags.includes(tag)));
    setShowModal(true);
  };

  const handleModalTagClick = (tag) => {
    setSelectedModalTags(selectedModalTags.includes(tag)
      ? selectedModalTags.filter(item => item !== tag)
      : [...selectedModalTags, tag]);
  };

  const handleCloseModal = () => {
    const newSelectedTags = [...selectedTags, ...selectedModalTags.filter(tag => !selectedTags.includes(tag))];
    setSelectedTags(newSelectedTags);
    setShowModal(false);
    setModalContent([]);
    setModalTitle('');
  };

  return (
    <Container>
      <SearchBar>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>
      <Content>
        <FilterPanel>
          <h3>Filter Panel</h3>
          <Section>
            <SectionTitle>Authors</SectionTitle>
            <TagList>
              {authors.slice(0, 5).map((author, index) => (
                <Tag key={index} onClick={() => handleTagClick(author)}>
                  {author}
                </Tag>
              ))}
            </TagList>
            {authors.length > 5 && (
              <MoreLink onClick={() => handleMoreClick('Authors', authors)}>More...</MoreLink>
            )}
          </Section>
          <Section>
            <SectionTitle>Genres</SectionTitle>
            <TagList>
              {genres.slice(0, 5).map((genre, index) => (
                <Tag key={index} onClick={() => handleTagClick(genre)}>
                  {genre}
                </Tag>
              ))}
            </TagList>
            {genres.length > 5 && (
              <MoreLink onClick={() => handleMoreClick('Genres', genres)}>More...</MoreLink>
            )}
          </Section>
          <Section>
            <SectionTitle>Languages</SectionTitle>
            <TagList>
              {languages.slice(0, 5).map((language, index) => (
                <Tag key={index} onClick={() => handleTagClick(language)}>
                  {language}
                </Tag>
              ))}
            </TagList>
            {languages.length > 5 && (
              <MoreLink onClick={() => handleMoreClick('Languages', languages)}>More...</MoreLink>
            )}
          </Section>
        </FilterPanel>
        <BooksContainer>
          <SelectedTags>
            {selectedTags.map(tag => (
              <SelectedTag key={tag}>
                {tag}
                <RemoveTag onClick={() => handleTagRemove(tag)}>x</RemoveTag>
              </SelectedTag>
            ))}
          </SelectedTags>
          <Books>
            {books.length > 0 ? books.map(book => (
              <Book key={book.id} onClick={() => navigate(`/books/${book.id}`)}>
                <img src={book.cover_image_url} alt={book.title} />
                <h4>{book.title}</h4>
                <p>{book.authors}</p>
              </Book>
            )) : (
              <p>No books found.</p>
            )}
          </Books>
        </BooksContainer>
        {showModal && (
          <Modal>
            <ModalContent>
              <CloseButton onClick={handleCloseModal}>X</CloseButton>
              <ModalTitle>{modalTitle}</ModalTitle>
              <SearchBar>
                <input
                  type="text"
                  placeholder={`Search ${modalTitle.toLowerCase()}...`}
                  onChange={(e) => setModalContent(modalContent.filter(tag => tag.toLowerCase().includes(e.target.value.toLowerCase())))}
                />
              </SearchBar>
              <ModalTagList>
                {modalContent.map((tag, index) => (
                  <ModalTag
                    key={index}
                    selected={selectedModalTags.includes(tag)}
                    onClick={() => handleModalTagClick(tag)}
                  >
                    {tag}
                  </ModalTag>
                ))}
              </ModalTagList>
              <ModalActions>
                <ApplyButton onClick={handleCloseModal}>Apply</ApplyButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </Container>
  );
};

// Styled components for styling
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  min-height: 100vh;
  color: #ddd;
  font-family: 'Arial', sans-serif;
  width: 100%;
  box-sizing: border-box;
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;

  input {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    border: 1px solid #d4af37;
    border-radius: 5px;
    background-color: #444;
    color: #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    outline: none;
    transition: border 0.3s, background-color 0.3s;

    &:focus {
      border-color: #007BFF;
      background-color: #555;
    }
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 90%; /* Adjust to 90% width */
  gap: 20px;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const FilterPanel = styled.div`
  width: 30%;
  padding: 20px;
  background-color: #444;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 10px;
  color: #d4af37;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
`;

const TagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Tag = styled.div`
  padding: 8px 12px;
  background-color: #555;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #777;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const MoreLink = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  color: #d4af37;
  text-decoration: underline;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`;

const BooksContainer = styled.div`
  flex: 3;
  padding: 20px;
  background-color: #444;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;

const SelectedTags = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectedTag = styled.div`
  background-color: #007BFF;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const RemoveTag = styled.span`
  margin-left: 5px;
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;

  &:hover {
    background-color: #ddd;
  }
`;

const Books = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Book = styled.div`
  width: calc(25% - 20px);
  min-width: 200px;
  max-width: 250px;
  text-align: center;
  background-color: #555;
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  h4 {
    margin: 10px 0 5px;
    font-size: 18px;
    color: #fff;
  }

  p {
    font-size: 14px;
    color: #ddd;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #333;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h4`
  margin-bottom: 10px;
  color: #d4af37;
  font-size: 20px;
  text-align: center;
`;

const ModalTagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalTag = styled.div`
  padding: 8px 12px;
  background-color: ${props => (props.selected ? '#007BFF' : '#555')};
  color: ${props => (props.selected ? '#fff' : '#ddd')};
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${props => (props.selected ? '#0062cc' : '#777')};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: #444;
  color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;

  &:hover {
    background-color: #555;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ApplyButton = styled.button`
  padding: 8px 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default FilterPage;
