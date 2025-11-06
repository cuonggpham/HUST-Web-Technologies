import { useState } from 'react';

function AddUser({ onAdd }) {
  // useState de quan ly trang thai hien/an form them user
  const [adding, setAdding] = useState(false);
  
  // useState de quan ly trang thai du lieu user dang nhap
  // State nay la controlled state cho cac input fields
  const [user, setUser] = useState({
    name: "", 
    username: "", 
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "", 
    website: ""
  });

  // Controlled Component: ham xu ly thay doi gia tri input
  // Cap nhat state user khi nguoi dung nhap lieu
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      // Cap nhat nested object (address) bang cach spread operator
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  // State Lifting: ham nay goi onAdd de truyen data len component cha (App)
  const handleAdd = () => {
    if (user.name === "" || user.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    // Lift state len component cha thong qua props onAdd
    onAdd(user);
    // Reset state ve gia tri mac dinh sau khi them
    setUser({ 
      name: "", 
      username: "", 
      email: "", 
      address: { street: "", suite: "", city: "" }, 
      phone: "", 
      website: "" 
    });
    setAdding(false);
  };

  return (
    <div>
      <button onClick={() => setAdding(true)}>Thêm</button>
      {adding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Thêm người dùng</h4>
            
            <label htmlFor="name">Name: </label>
            {/* Controlled Component: value duoc quan ly boi state user.name */}
            <input 
              id="name" 
              type="text" 
              value={user.name}
              onChange={handleChange}
            />

            <label htmlFor="username">Username: </label>
            <input 
              id="username" 
              type="text" 
              value={user.username}
              onChange={handleChange}
            />

            <label htmlFor="email">Email: </label>
            <input 
              id="email" 
              type="text" 
              value={user.email}
              onChange={handleChange}
            />

            <label htmlFor="street">Street: </label>
            <input 
              id="street" 
              type="text" 
              value={user.address.street}
              onChange={handleChange}
            />

            <label htmlFor="suite">Suite: </label>
            <input 
              id="suite" 
              type="text" 
              value={user.address.suite}
              onChange={handleChange}
            />

            <label htmlFor="city">City: </label>
            <input 
              id="city" 
              type="text" 
              value={user.address.city}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone: </label>
            <input 
              id="phone" 
              type="text" 
              value={user.phone}
              onChange={handleChange}
            />

            <label htmlFor="website">Website: </label>
            <input 
              id="website" 
              type="text" 
              value={user.website}
              onChange={handleChange}
            />

            <button onClick={handleAdd}>Lưu</button>
            <button onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;