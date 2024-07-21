import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const NotificationIcon = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/books/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef]);

  const toggleNotificationPopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <Icon onClick={toggleNotificationPopup}>🔔</Icon>
      {isOpen && (
        <Popup ref={popupRef}>
          <Title>Notifications</Title>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem key={index}>
                <Message>Your book <BookTitle>{notification.title}</BookTitle> is <Status>{notification.status}</Status>.</Message>
              </NotificationItem>
            ))
          ) : (
            <NoNotificationMessage>No notifications to show.</NoNotificationMessage>
          )}
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const Icon = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  color: gold;
`;

const Popup = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const Title = styled.h3`
  margin: 0;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const Message = styled.p`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const BookTitle = styled.span`
  color: #000;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Status = styled.span`
  color: #d9534f;
  font-weight: bold;
  font-size: 1.2rem;
`;

const NoNotificationMessage = styled.p`
  padding: 1rem;
  color: #666;
  text-align: center;
  font-size: 1.2rem;
`;

export default NotificationIcon;
