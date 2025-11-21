import { useState, useEffect } from 'react';
import './App.css';
import UserTable from './components/UserTable';
import AddUserForm from './components/AddUserForm';
import EditUserModal from './components/EditUserModal';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Toast from './components/Toast';

// BASE_URL cua API - JSONPlaceholder la fake REST API de test
const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  // State quan ly danh sach nguoi dung
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const usersPerPage = 5;

  // Ham hien thi thong bao toast
  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // ==================== GET REQUEST - LAY DANH SACH NGUOI DUNG ====================
  // Su dung fetch API de lay du lieu tu server
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // FETCH API: Phuong thuc GET (mac dinh) de lay du lieu
      // fetch() tra ve mot Promise chua Response object
      const response = await fetch(API_URL);
      
      // Kiem tra HTTP status code
      // response.ok = true neu status trong khoang 200-299
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // response.json() chuyen du lieu JSON thanh JavaScript object
      // Day cung la mot Promise nen can await
      const data = await response.json();
      setUsers(data);
      showToast('Tai du lieu nguoi dung thanh cong!', 'success');
    } catch (err) {
      // Xu ly loi: co the la loi network, loi parse JSON, hoac loi HTTP
      const errorMessage = `Khong the tai du lieu: ${err.message}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error fetching users:', err);
    } finally {
      // finally luon chay du co loi hay khong
      setLoading(false);
    }
  };

  // useEffect: Goi API khi component mount lan dau
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================== POST REQUEST - THEM NGUOI DUNG MOI ====================
  const handleAddUser = async (userData) => {
    try {
      setError(null);
      
      // Validate du lieu truoc khi gui len server
      if (!userData.name || !userData.email || !userData.phone) {
        throw new Error('Vui long dien day du cac truong bat buoc');
      }
      
      // Validate dinh dang email bang Regular Expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Email khong hop le');
      }
      
      // FETCH API: Phuong thuc POST de gui du lieu len server
      const response = await fetch(API_URL, {
        method: 'POST',              // Phuong thuc HTTP
        headers: {
          'Content-Type': 'application/json',  // Dinh dang du lieu gui di
        },
        body: JSON.stringify(userData),  // Chuyen object thanh JSON string
      });

      // Kiem tra response tu server
      if (!response.ok) {
        throw new Error(`Loi server: ${response.status}`);
      }

      // Lay du lieu tra ve tu server (neu co)
      await response.json();
      
      // Cap nhat state local (vi JSONPlaceholder khong luu du lieu that)
      const userWithId = {
        ...userData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      };
      setUsers(prevUsers => [userWithId, ...prevUsers]);
      
      showToast('Them nguoi dung thanh cong!', 'success');
      return true;
    } catch (err) {
      // Xu ly cac loi: validation, network, server error
      const errorMessage = `Khong the them nguoi dung: ${err.message}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error adding user:', err);
      return false;
    }
  };

  // ==================== PUT REQUEST - CAP NHAT THONG TIN NGUOI DUNG ====================
  const handleUpdateUser = async (userId, userData) => {
    try {
      setError(null);
      
      // Validate du lieu
      if (!userData.name || !userData.email || !userData.phone) {
        throw new Error('Vui long dien day du cac truong bat buoc');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Email khong hop le');
      }
      
      // FETCH API: Phuong thuc PUT de cap nhat du lieu
      // PUT thay the toan bo resource, con PATCH chi cap nhat mot phan
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',               // Phuong thuc HTTP PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),  // Du lieu can cap nhat
      });

      if (!response.ok) {
        throw new Error(`Loi server: ${response.status}`);
      }

      await response.json();
      
      // Cap nhat state local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, ...userData } : user
        )
      );
      
      showToast('Cap nhat nguoi dung thanh cong!', 'success');
      return true;
    } catch (err) {
      const errorMessage = `Khong the cap nhat nguoi dung: ${err.message}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error updating user:', err);
      return false;
    }
  };

  // ==================== DELETE REQUEST - XOA NGUOI DUNG ====================
  const handleDeleteUser = async (userId) => {
    // Xac nhan truoc khi xoa
    if (!window.confirm('Ban co chac chan muon xoa nguoi dung nay khong?')) {
      return;
    }

    try {
      setError(null);
      
      // FETCH API: Phuong thuc DELETE de xoa du lieu
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',    // Phuong thuc HTTP DELETE
      });

      if (!response.ok) {
        throw new Error(`Loi server: ${response.status}`);
      }

      // Xoa khoi state local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      showToast('Xoa nguoi dung thanh cong!', 'success');
    } catch (err) {
      const errorMessage = `Khong the xoa nguoi dung: ${err.message}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Quản Lý Người Dùng</h1>
        </header>

        {error && (
          <div className="error-message">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <AddUserForm onAddUser={handleAddUser} />

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <>
            <UserTable
              users={currentUsers}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
            />

            <div className="results-info">
              Hiển thị {currentUsers.length} / {filteredUsers.length} người dùng
              {searchTerm && ` (lọc từ ${users.length} tổng)`}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onUpdateUser={handleUpdateUser}
            onClose={handleCloseModal}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </div>
  );
}

export default App;
