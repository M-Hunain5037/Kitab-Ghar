import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBook, FaListAlt, FaEdit } from 'react-icons/fa';
import logo from '../assets/user.png'; // Assuming you have a logo image
import Modal from './Modal'; // Import Modal component
import ManageBooks from '../components/ManageBooks'; // Import ManageBooks component
import ViewApprovedBooks from '../components/ViewApprovedBooks'; // Import ViewApprovedBooks component

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [editUser, setEditUser] = useState(null); // Edit user state
  const location = useLocation();
  const [showBooks, setShowBooks] = useState(false);
  const [showApprovedBooks, setShowApprovedBooks] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Load API base URL from environment variable

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/admin`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchUsers();
    fetchAdmin();
  }, [API_BASE_URL]);

  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
    setShowModal(false);
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${updatedUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.map(user => user.id === updatedUser.id ? response.data : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setShowModal(false);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardContainer>
      <Sidebar>
        <LogoContainer>
          <Logo src={logo} alt="کتاب گھر" />
        </LogoContainer>
        <AdminInfo>
          <AdminName>{admin.name}</AdminName>
          <AdminRole>Admin</AdminRole>
        </AdminInfo>
        <SidebarMenu>
          <SidebarItem
            to="#"
            onClick={() => {
              setShowBooks(false);
              setShowApprovedBooks(false);
            }}
            active={location.pathname === '/admin-dashboard' && !showBooks && !showApprovedBooks ? 'true' : 'false'}
          >
            <FaUser /> Manage Users
          </SidebarItem>
          <SidebarItem
            to="#"
            onClick={() => {
              setShowBooks(true);
              setShowApprovedBooks(false);
            }}
            active={showBooks ? 'true' : 'false'}
          >
            <FaBook /> Manage Books
          </SidebarItem>
          <SidebarItem
            to="#"
            onClick={() => {
              setShowBooks(false);
              setShowApprovedBooks(true);
            }}
            active={showApprovedBooks ? 'true' : 'false'}
          >
            <FaListAlt /> View All Approved Books
          </SidebarItem>
        </SidebarMenu>
      </Sidebar>
      <MainContent>
        {showBooks ? (
          <ManageBooks />
        ) : showApprovedBooks ? (
          <ViewApprovedBooks />
        ) : (
          <>
            <Header>
              <AddButton onClick={() => setShowModal(true)}>Add</AddButton>
            </Header>
            <Content>
              <h2>Manage Users</h2>
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <FaEdit onClick={() => openEditModal(user)} style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination>
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                  <PageNumber key={index + 1} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </PageNumber>
                ))}
              </Pagination>
            </Content>
          </>
        )}
      </MainContent>
      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={editUser ? handleEditUser : handleAddUser}
        user={editUser}
      />
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif; /* Set a default font for consistency */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack sidebar on top of main content */
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Add shadow for depth */

  @media (max-width: 768px) {
    width: 100%;
    height: auto; /* Adjust height for stacking layout */
    padding: 0.5rem; /* Reduce padding for small screens */
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem; /* Reduce spacing on small screens */
  }
`;

const Logo = styled.img`
  width: 150px;
  border-radius: 50%; /* Circular logo for a modern look */

  @media (max-width: 768px) {
    width: 100px; /* Smaller logo for small screens */
  }
`;

const AdminInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.5rem; /* Reduce margin for small screens */
  }
`;

const AdminName = styled.h2`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.4rem; /* Increased for better visibility */
  font-weight: bold; /* Emphasize admin name */
  margin: 0; /* Remove default margin */

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Adjust font size for small screens */
  }
`;

const AdminRole = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  margin: 0; /* Remove default margin */

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Adjust font size for small screens */
  }
`;

const SidebarMenu = styled.div`
  width: 100%;
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  padding: 1rem;
  transition: background-color 0.3s;
  background-color: ${({ active }) => (active === 'true' ? '#D4AF37' : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: #fff; /* White text on hover for contrast */
  }

  svg {
    margin-right: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem; /* Adjust padding for small screens */
    font-size: 0.9rem; /* Adjust font size for small screens */
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  overflow-y: auto;
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.1); /* Inner shadow for content depth */

  @media (max-width: 768px) {
    padding: 1rem; /* Adjust padding for small screens */
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem; /* Adjust margin for small screens */
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold; /* Emphasize action button */
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark}; /* Adjust hover effect */
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem; /* Adjust padding for small screens */
    font-size: 0.875rem; /* Adjust font size for small screens */
  }
`;

const Content = styled.div`
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem; /* Increase heading size */
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary}; /* Add border for separation */
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.25rem; /* Adjust font size for small screens */
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 0.875rem; /* Ensure readability */

    @media (max-width: 768px) {
      padding: 0.5rem; /* Adjust padding for small screens */
    }
  }

  th {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textLight};
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PageNumber = styled.span`
  margin: 0 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primaryDark}; /* Adjust hover color */
  }

  @media (max-width: 768px) {
    font-size: 0.875rem; /* Adjust font size for small screens */
  }
`;

export default AdminDashboard;
