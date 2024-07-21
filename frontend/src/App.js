// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UploadPage from './pages/UploadPage';
import BookDetails from './pages/BookDetail'; // Import the BookDetails component
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';

const PrivateRoute = ({ element, roles, ...rest }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');

  return roles.includes(role) ? element : <Navigate to="/" state={{ from: location }} />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInState = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInState);
  }, []);

  const handleLogin = (loginState) => {
    setIsLoggedIn(loginState);
    localStorage.setItem('isLoggedIn', loginState);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HeroSection isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<LoginForm setIsLoggedIn={handleLogin} />} />
        <Route path="/register" element={<RegisterForm setIsLoggedIn={handleLogin} />} />
        <Route path="/dashboard" element={<PrivateRoute roles={['user']} element={<Dashboard />} />} />
        <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']} element={<AdminDashboard />} />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/books/:id" element={<BookDetails />} />

      </Routes>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
