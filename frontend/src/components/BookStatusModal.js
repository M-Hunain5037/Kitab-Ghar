import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BookStatusModal = ({ onClose }) => {
  const [bookStatuses, setBookStatuses] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Load API base URL from environment variable

  useEffect(() => {
    const fetchBookStatuses = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Ensure userId is correctly fetched
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/books/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookStatuses(response.data);
      } catch (error) {
        console.error('Error fetching book statuses', error);
      }
    };

    fetchBookStatuses();
  }, [API_BASE_URL]); // Add API_BASE_URL as a dependency to re-fetch if it changes

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>Book Request Statuses</h2>
        {bookStatuses.length > 0 ? (
          <StatusList>
            {bookStatuses.map((book, index) => (
              <StatusItem key={index}>
                <strong>{book.title}</strong>: {book.status}
              </StatusItem>
            ))}
          </StatusList>
        ) : (
          <p>No book requests found.</p>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;

  h2 {
    color: #d4af37;
    margin-bottom: 1rem;
  }

  p {
    color: #555;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatusItem = styled.li`
  background: #f0f2f5;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  text-align: left;
`;

export default BookStatusModal;
