import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithGoogle } from '../components/firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import googleIcon from '../assets/google-icon.jpg';

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      if (response.status === 200) {
        alert('Login successful!');
        setIsLoggedIn(true);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);
        navigate(response.data.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      alert('Login successful with Google!');
      const fullName = user.displayName;
      const email = user.email;
      const role = 'user';
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-login`, { fullName, email, role });
      if (response.status === 200 || response.status === 201) {
        const { token, role, userId, userName } = response.data;
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <Button type="submit">Login</Button>
        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google icon" /> Sign in with Google
        </GoogleButton>
        <RegisterLink>
          Don't have an account? <Link to="/register">Register yourself</Link>
        </RegisterLink>
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
  width: 90%;
  margin: 0 auto;

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
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  img {
    width: 20px;
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;

    img {
      width: 18px;
    }
  }
`;

const RegisterLink = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #d4af37;

  a {
    color: #d4af37;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export default LoginForm;
