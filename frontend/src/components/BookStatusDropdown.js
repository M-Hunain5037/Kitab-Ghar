import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BookStatusDropdown = () => {
  const [bookStatuses, setBookStatuses] = useState([]);

  useEffect(() => {
    const fetchBookStatuses = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/books/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookStatuses(response.data);
      } catch (error) {
        console.error('Error fetching book statuses', error);
      }
    };

    fetchBookStatuses();
  }, []);

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
  top: 60px;
  right: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
`;

const DropdownContent = styled.div`
  padding: 1rem;
  text-align: left;

  h2 {
    color: #007BFF;
    margin-bottom: 1rem;
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
`;

const StatusItem = styled.li`
  background: #f0f2f5;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

export default BookStatusDropdown;
