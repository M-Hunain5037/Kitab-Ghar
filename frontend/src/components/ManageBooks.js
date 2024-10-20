import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showCoverPreview, setShowCoverPreview] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [selectedCoverUrl, setSelectedCoverUrl] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPendingBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/pending`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setStatusMessage('Error fetching pending book requests');
      }
    };

    fetchPendingBooks();
  }, [API_BASE_URL]);

  const handleUpdateStatus = async (bookId, newStatus) => {
    try {
      if (newStatus === 'rejected') {
        const response = await axios.delete(`${API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 200) {
          setBooks(books.filter(book => book.id !== bookId));
          setStatusMessage('Book rejected and removed from database');
        }
      } else {
        const response = await axios.put(`${API_BASE_URL}/api/books/${bookId}`, 
          { status: newStatus }, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        if (response.status === 200) {
          setBooks(books.map(book => (book.id === bookId ? { ...book, status: newStatus } : book)));
          setStatusMessage(`Book status updated to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  const handlePdfPreview = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    setShowPdfPreview(true);
  };

  const handleCoverPreview = (coverUrl) => {
    setSelectedCoverUrl(coverUrl);
    setShowCoverPreview(true);
  };

  return (
    <Container>
      <Title>Manage Pending Book Requests</Title>
      {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}
      {books.length === 0 ? (
        <NoRequestMessage>No New Book Requests</NoRequestMessage>
      ) : (
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
                <td>{book.uploaded_by}</td>
                <td>{book.status}</td>
                <td>
                  <Button onClick={() => handleUpdateStatus(book.id, 'approved')}>Approve</Button>
                  <Button onClick={() => handleUpdateStatus(book.id, 'rejected')}>Reject</Button>
                  <Button onClick={() => handlePdfPreview(book.book_file_url)}>Download PDF</Button>
                  <Button onClick={() => handleCoverPreview(book.cover_image_url)}>Preview Cover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showPdfPreview && (
        <ModalOverlay onClick={() => setShowPdfPreview(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>PDF Preview</h2>
            <iframe src={selectedPdfUrl} title="PDF Preview"></iframe>
            <Button onClick={() => setShowPdfPreview(false)}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )}

      {showCoverPreview && (
        <ModalOverlay onClick={() => setShowCoverPreview(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Cover Preview</h2>
            <img src={selectedCoverUrl} alt="Cover" />
            <Button onClick={() => setShowCoverPreview(false)}>Close</Button>
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

const StatusMessage = styled.div`
  margin-bottom: 1rem;
  color: green;
`;

const NoRequestMessage = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 0.875rem;

    @media (max-width: 768px) {
      padding: 0.5rem;
      font-size: 0.75rem;
    }
  }

  th {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textLight};
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
    background-color: black;
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
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }

  iframe {
    border: none;
    width: 100%;
    height: 500px;

    @media (max-width: 768px) {
      height: 300px;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    margin-top: 1rem;
  }
`;

export default ManageBooks;
