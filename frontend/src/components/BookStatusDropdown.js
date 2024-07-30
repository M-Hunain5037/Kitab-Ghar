import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BookStatusDropdown = () => {
  const [bookStatuses, setBookStatuses] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBookStatuses = async () => {
      try {
        const userId = localStorage.getItem('userId');
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
  }, [API_BASE_URL]); // Ensure this effect re-runs if API_BASE_URL changes

  return (
    <DropdownContainer>
      <DropdownContent>
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
          <p>No notifications to show.</p>
        )}
      </DropdownContent>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: absolute;
  top: 60px; /* Adjust based on the Navbar height */
  right: 10px; /* Adjust based on your layout */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
  overflow: hidden; /* Prevent content overflow */
`;

const DropdownContent = styled.div`
  padding: 1rem;
  text-align: left;

  h2 {
    color: #d4af37;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    color: #555;
  }
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px; /* Set a max height to make the list scrollable if it's too long */
  overflow-y: auto; /* Add vertical scroll if content exceeds max height */
`;

const StatusItem = styled.li`
  background: #f0f2f5;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

export default BookStatusDropdown;
