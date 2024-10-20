import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ViewApprovedBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    user_name: '',
    status: ''
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/approved`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [API_BASE_URL]);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      authors: book.authors,
      user_name: book.user_name,
      status: book.status
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/books/${selectedBook.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooks(books.map(book => book.id === selectedBook.id ? response.data : book));
      setShowModal(false);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <Container>
      <Title>View Approved Books</Title>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Uploaded By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.authors}</td>
                <td>{book.uploaded_by}</td> {/* Ensure this matches the backend response */}
                <td>{book.status}</td>
                <td>
                  <Button onClick={() => handleEdit(book)}>Edit</Button>
                  <Button onClick={() => handleDelete(book.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Book</h2>
            <Form onSubmit={handleSave}>
              <Label>
                Title:
                <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </Label>
              <Label>
                Authors:
                <Input type="text" name="authors" value={formData.authors} onChange={handleChange} required />
              </Label>
              <Label>
                User:
                <Input type="text" name="user_name" value={formData.user_name} onChange={handleChange} required />
              </Label>
              <Label>
                Status:
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </Label>
              <Button type="submit">Save</Button>
              <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  color: #1c1c1c;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  color: black;

  th, td {
    border: 1px solid #444;
    padding: 0.75rem;
    text-align: left;

    @media (max-width: 768px) {
      padding: 0.5rem;
      font-size: 0.75rem;
    }
  }

  th {
    background-color: black;
    color: white;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  background-color: #1c1c1c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #1c1c1c;
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    color: white;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  text-align: left;
  color: white;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Select = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export default ViewApprovedBooks;
