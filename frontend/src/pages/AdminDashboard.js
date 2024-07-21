import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBook, FaListAlt, FaSignOutAlt, FaEdit } from 'react-icons/fa';
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/admin', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchUsers();
    fetchAdmin();
  }, []);

  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', newUser, {
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
      const response = await axios.put(`http://localhost:5000/api/users/${updatedUser.id}`, updatedUser, {
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
        <LogoutButton>
          <FaSignOutAlt /> Logout
        </LogoutButton>
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
  overflow: hidden;
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
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 150px;
`;

const AdminInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem; /* Adjust margin for better spacing */
`;

const AdminName = styled.h2`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.2rem; /* Increase font size for better visibility */
`;

const AdminRole = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem; /* Increase font size for better visibility */
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
  background-color: ${({ active }) => (active === 'true' ? '#D4AF37' : 'transparent')}; /* Update color to yellow for active items */

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

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Content = styled.div`
  h2 {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left; /* Align text to the left */
    font-weight: bold; /* Make table text bold */
    color: ${({ theme }) => theme.colors.primary}; /* Add primary color to table text */
  }

  th {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textLight};
  }

  tr:hover {
    background-color: #f5f5f5; /* Light gray for row hover effect */
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
  font-weight: bold; /* Make page numbers bold */

  &:hover {
    text-decoration: underline;
  }
`;

export default AdminDashboard;
