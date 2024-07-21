import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password, fullName });
      alert('Registration successful!');
      setIsLoggedIn(true);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <h2>Register</h2>
        
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Register</Button>
        <LoginLink>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginLink>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundDark};
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.backgroundLight};
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;

  h2 {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 0.25rem;
    margin: 0.5rem 0;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
`;

const LoginLink = styled.div`
  margin-top: 1rem;
  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default RegisterForm;
