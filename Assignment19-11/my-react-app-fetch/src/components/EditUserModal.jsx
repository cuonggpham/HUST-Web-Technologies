import React, { useState } from 'react';
import './EditUserModal.css';

// Component modal de chinh sua thong tin nguoi dung
const EditUserModal = ({ user, onUpdateUser, onClose }) => {
  // Khoi tao state voi du lieu hien tai cua user
  // Su dung optional chaining (?.) de tranh loi khi du lieu null/undefined
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    website: user?.website || '',
    address: {
      street: user?.address?.street || '',
      suite: user?.address?.suite || '',
      city: user?.address?.city || '',
      zipcode: user?.address?.zipcode || ''
    },
    company: {
      name: user?.company?.name || '',
      catchPhrase: user?.company?.catchPhrase || '',
      bs: user?.company?.bs || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Xu ly submit form - goi API PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      // Goi ham onUpdateUser (tu App.jsx) - se thuc hien PUT request
      const success = await onUpdateUser(user.id, formData);
      
      // Chi dong modal neu cap nhat thanh cong
      if (success) {
        onClose();
      }
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Sửa người dùng</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Name: *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-username">Username:</label>
            <input
              type="text"
              id="edit-username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-email">Email: *</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-phone">Phone: *</label>
            <input
              type="tel"
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-website">Website:</label>
            <input
              type="text"
              id="edit-website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website"
            />
          </div>

          <h4 style={{color: '#1b5e20', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '1rem', textAlign: 'left'}}>Address</h4>
          
          <div className="form-group">
            <label htmlFor="edit-address.street">Street:</label>
            <input
              type="text"
              id="edit-address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Enter street"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-address.suite">Suite:</label>
            <input
              type="text"
              id="edit-address.suite"
              name="address.suite"
              value={formData.address.suite}
              onChange={handleChange}
              placeholder="Enter suite/apt"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-address.city">City:</label>
            <input
              type="text"
              id="edit-address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-address.zipcode">Zipcode:</label>
            <input
              type="text"
              id="edit-address.zipcode"
              name="address.zipcode"
              value={formData.address.zipcode}
              onChange={handleChange}
              placeholder="Enter zipcode"
            />
          </div>

          <h4 style={{color: '#1b5e20', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '1rem', textAlign: 'left'}}>Company</h4>
          
          <div className="form-group">
            <label htmlFor="edit-company.name">Company Name:</label>
            <input
              type="text"
              id="edit-company.name"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-company.catchPhrase">Catch Phrase:</label>
            <input
              type="text"
              id="edit-company.catchPhrase"
              name="company.catchPhrase"
              value={formData.company.catchPhrase}
              onChange={handleChange}
              placeholder="Enter catch phrase"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-company.bs">Business:</label>
            <input
              type="text"
              id="edit-company.bs"
              name="company.bs"
              value={formData.company.bs}
              onChange={handleChange}
              placeholder="Enter business"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-submit">LƯU</button>
            <button type="button" className="btn-cancel" onClick={onClose}>HỦY</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
