import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaBook, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/user.png'; // Assuming you have a logo image

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <LogoContainer>
        <Logo src={logo} alt="کتاب گھر" />
      </LogoContainer>
      <AdminInfo>
        <ProfilePicture src="path-to-profile-picture.jpg" alt="Admin" />
        <AdminName>Admin Name</AdminName>
        <AdminRole>Book Store Admin</AdminRole>
      </AdminInfo>
      <SidebarMenu>
        <SidebarItem to="/admin-dashboard" active={location.pathname === '/admin-dashboard'}>
          <FaUser /> Manage Users
        </SidebarItem>
        <SidebarItem to="/admin-dashboard/manage-books" active={location.pathname === '/admin-dashboard/manage-books'}>
          <FaBook /> Manage Books
        </SidebarItem>
        <SidebarItem to="/admin-dashboard/manage-categories" active={location.pathname === '/admin-dashboard/manage-categories'}>
          <FaListAlt /> Manage Categories
        </SidebarItem>
      </SidebarMenu>
      <LogoutButton>
        <FaSignOutAlt /> Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 150px;
`;

const AdminInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfilePicture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const AdminName = styled.h2`
  color: ${({ theme }) => theme.colors.textLight};
`;

const AdminRole = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const SidebarMenu = styled.div`
  width: 100%;
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme, active }) => active ? theme.colors.secondary : theme.colors.textLight};
  text-decoration: none;
  padding: 1rem;
  transition: background-color 0.3s;
  background-color: ${({ theme, active }) => active ? theme.colors.secondary : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  svg {
    margin-right: 1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
  transition: background-color 0.3s;
  margin-top: auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  svg {
    margin-right: 1rem;
  }
`;

export default Sidebar;
