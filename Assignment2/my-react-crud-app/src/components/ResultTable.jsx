import { useState, useEffect } from 'react';

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Khi prop user thay đổi → thêm vào danh sách
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user, onAdded]);

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(keyword.toLowerCase()) ||
           u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Sao chép dữ liệu user sang state editing (Deep Copy)
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // Xử lý thay đổi trong form edit
  const handleEditChange = (field, value) => {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  };

  // Lưu sau khi chỉnh sửa
  function saveUser() {
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  }

  // Xóa người dùng
  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id != id));
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Result Table</h2>
      
      {editing && (
        <div>
          <h4>Sửa người dùng</h4>
          
          <label htmlFor="name">Name: </label>
          <input 
            id="name" 
            type="text" 
            value={editing.name}
            onChange={(e) => handleEditChange("name", e.target.value)}
          />
          <br />

          <label htmlFor="username">Username: </label>
          <input 
            id="username" 
            type="text" 
            value={editing.username}
            onChange={(e) => handleEditChange("username", e.target.value)}
          />
          <br />

          <label htmlFor="email">Email: </label>
          <input 
            id="email" 
            type="text" 
            value={editing.email}
            onChange={(e) => handleEditChange("email", e.target.value)}
          />
          <br />

          <label htmlFor="street">Street: </label>
          <input 
            id="street" 
            type="text" 
            value={editing.address.street}
            onChange={(e) => handleEditChange("street", e.target.value)}
          />
          <br />

          <label htmlFor="suite">Suite: </label>
          <input 
            id="suite" 
            type="text" 
            value={editing.address.suite}
            onChange={(e) => handleEditChange("suite", e.target.value)}
          />
          <br />

          <label htmlFor="city">City: </label>
          <input 
            id="city" 
            type="text" 
            value={editing.address.city}
            onChange={(e) => handleEditChange("city", e.target.value)}
          />
          <br />

          <label htmlFor="phone">Phone: </label>
          <input 
            id="phone" 
            type="text" 
            value={editing.phone}
            onChange={(e) => handleEditChange("phone", e.target.value)}
          />
          <br />

          <label htmlFor="website">Website: </label>
          <input 
            id="website" 
            type="text" 
            value={editing.website}
            onChange={(e) => handleEditChange("website", e.target.value)}
          />
          <br />

          <button onClick={saveUser}>Lưu</button>
          <button onClick={() => setEditing(null)}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;