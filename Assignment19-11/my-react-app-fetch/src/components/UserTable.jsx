import React from 'react';
import './UserTable.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">Không tìm thấy người dùng</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(user)}
                  >
                    SỬA
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(user.id)}
                  >
                    XÓA
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
