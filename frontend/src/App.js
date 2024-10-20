// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UploadPage from './pages/UploadPage';
import BookDetails from './pages/BookDetail';
import About from './pages/About';
import FilterPage from './components/FilterPage';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import styled from 'styled-components';

const PrivateRoute = ({ element, roles }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return roles.includes(role) ? element : <Navigate to="/" state={{ from: location }} />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
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

  const shouldDisplayFooter = !['/dashboard', '/admin-dashboard', '/filter', '/upload'].includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <MainContent>
          <Routes>
            <Route path="/" element={<HeroSection isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<LoginForm setIsLoggedIn={handleLogin} />} />
            <Route path="/register" element={<RegisterForm setIsLoggedIn={handleLogin} />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<PrivateRoute roles={['user']} element={<Dashboard />} />} />
            <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']} element={<AdminDashboard />} />} />
            <Route path="/upload" element={<PrivateRoute roles={['user', 'admin']} element={<UploadPage />} />} />
            <Route path="/books/:id" element={<PrivateRoute roles={['user', 'admin']} element={<BookDetails />} />} />
            <Route path="/filter" element={<PrivateRoute roles={['user', 'admin']} element={<FilterPage />} />} />
          </Routes>
        </MainContent>
        <FooterWrapper shouldDisplayFooter={shouldDisplayFooter}>
          {shouldDisplayFooter && <Footer />}
        </FooterWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the container takes at least the full height of the viewport */
`;

const MainContent = styled.main`
  flex: 1; /* Allows this section to grow and fill the space */
`;

const FooterWrapper = styled.div`
  position: ${({ shouldDisplayFooter }) => (shouldDisplayFooter ? 'relative' : 'fixed')};
  width: 100%;
  bottom: 0;
`;

export default App;
