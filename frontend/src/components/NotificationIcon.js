import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const NotificationIcon = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/books/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId, API_BASE_URL]);

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
  }, []);

  const toggleNotificationPopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <Icon onClick={toggleNotificationPopup}>🔔</Icon>
      {isOpen && (
        <>
          <Overlay onClick={toggleNotificationPopup} isOpen={isOpen} />
          <Popup ref={popupRef} isOpen={isOpen}>
            <Title>
              Notifications
              <CloseButton onClick={toggleNotificationPopup}>✖</CloseButton>
            </Title>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationItem key={index}>
                  <Message>
                    Your book <BookTitle>{notification.title}</BookTitle> is{' '}
                    <Status>{notification.status}</Status>.
                  </Message>
                </NotificationItem>
              ))
            ) : (
              <NoNotificationMessage>No notifications to show.</NoNotificationMessage>
            )}
          </Popup>
        </>
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

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  @media (min-width: 768px) {
    display: none; /* Hide overlay on larger screens */
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  overflow-y: auto;
  z-index: 1001;

  @media (min-width: 768px) {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    max-height: 300px;
  }
`;

const Title = styled.h3`
  margin: 0;
  padding: 1rem;
  background-color: #d4af37;
  color: #fff;
  border-bottom: 1px solid #ddd;
  border-radius: 5px 5px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.span`
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
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
