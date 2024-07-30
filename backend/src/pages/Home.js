import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import RecommendedBooks from '../components/RecommendedBooks';
import Footer from '../components/Footer';

const Home = ({ isLoggedIn, handleLogout }) => {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <HeroSection />
      <RecommendedBooks />
      <Footer />
    </>
  );
};

export default Home;
