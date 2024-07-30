import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Modal = ({ show, handleClose, handleSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{user ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleClose}>Cancel</button>
        </form>
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
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    label {
      margin-bottom: 0.5rem;
      text-align: left;
    }

    input,
    select {
      margin-bottom: 1rem;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 0.5rem;
    }

    button[type='submit'] {
      background: #d4af37;
      color: white;
    }

    button[type='button'] {
      background: #6c757d;
      color: white;
    }
  }
`;

export default Modal;
