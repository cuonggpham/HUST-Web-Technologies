import { useState, useEffect } from 'react';

function ResultTable({ keyword, user, onAdded }) {
  // useState de quan ly danh sach users
  const [users, setUsers] = useState([]);
  // useState de quan ly trang thai loading
  const [loading, setLoading] = useState(true);
  // useState de quan ly user dang duoc chinh sua
  const [editing, setEditing] = useState(null);

  // useEffect chay 1 lan khi component mount de fetch data tu API
  // Dependency array rong [] => chi chay 1 lan duy nhat
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // useEffect lang nghe su thay doi cua prop user tu component cha
  // Khi user thay doi (co user moi), them vao danh sach
  // Dependency array [user, onAdded] => chay khi user hoac onAdded thay doi
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      // Goi callback onAdded de thong bao cho component cha
      onAdded();
    }
  }, [user, onAdded]);

  // Filter users dua tren keyword duoc truyen tu component cha (State Lifting)
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(keyword.toLowerCase()) ||
           u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Set state editing khi click nut Sua
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // Controlled Component: ham xu ly thay doi gia tri input khi edit
  const handleEditChange = (field, value) => {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  };

  function saveUser() {
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  }

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
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Sửa người dùng</h4>
            
            <label htmlFor="name">Name: </label>
            {/* Controlled Component: gia tri input duoc dieu khien boi state editing */}
            <input 
              id="name" 
              type="text" 
              value={editing.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />

            <label htmlFor="username">Username: </label>
            <input 
              id="username" 
              type="text" 
              value={editing.username}
              onChange={(e) => handleEditChange("username", e.target.value)}
            />

            <label htmlFor="email">Email: </label>
            <input 
              id="email" 
              type="text" 
              value={editing.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />

            <label htmlFor="street">Street: </label>
            <input 
              id="street" 
              type="text" 
              value={editing.address.street}
              onChange={(e) => handleEditChange("street", e.target.value)}
            />

            <label htmlFor="suite">Suite: </label>
            <input 
              id="suite" 
              type="text" 
              value={editing.address.suite}
              onChange={(e) => handleEditChange("suite", e.target.value)}
            />

            <label htmlFor="city">City: </label>
            <input 
              id="city" 
              type="text" 
              value={editing.address.city}
              onChange={(e) => handleEditChange("city", e.target.value)}
            />

            <label htmlFor="phone">Phone: </label>
            <input 
              id="phone" 
              type="text" 
              value={editing.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
            />

            <label htmlFor="website">Website: </label>
            <input 
              id="website" 
              type="text" 
              value={editing.website}
              onChange={(e) => handleEditChange("website", e.target.value)}
            />

            <button onClick={saveUser}>Lưu</button>
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
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