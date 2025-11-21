import React, { useState } from 'react';
import './AddUserForm.css';

// Component form them nguoi dung moi
const AddUserForm = ({ onAddUser }) => {
  // State luu tru du lieu form - object long nhau (nested object)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: ''
    },
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  });
  const [showForm, setShowForm] = useState(false);

  // Xu ly thay doi gia tri input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Xu ly nested object (vd: address.city, company.name)
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

  // Xu ly submit form - goi API POST
  const handleSubmit = async (e) => {
    e.preventDefault();  // Ngan chan reload trang
    
    // Kiem tra cac truong bat buoc
    if (formData.name && formData.email && formData.phone) {
      // Goi ham onAddUser (tu App.jsx) - se thuc hien POST request
      const success = await onAddUser(formData);
      
      // Chi reset form va dong modal neu them thanh cong
      if (success) {
        setFormData({
          name: '',
          username: '',
          email: '',
          phone: '',
          website: '',
          address: { street: '', suite: '', city: '', zipcode: '' },
          company: { name: '', catchPhrase: '', bs: '' }
        });
        setShowForm(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      website: '',
      address: { street: '', suite: '', city: '', zipcode: '' },
      company: { name: '', catchPhrase: '', bs: '' }
    });
    setShowForm(false);
  };

  return (
    <div className="add-user-container">
      <button 
        className="btn-add-user"
        onClick={() => setShowForm(true)}
      >
        THÊM
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm người dùng</h3>
              <button className="btn-close" onClick={handleCancel}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name: *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email: *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone: *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website:</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website"
            />
          </div>

          <h4 style={{color: '#1b5e20', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '1rem'}}>Address</h4>
          
          <div className="form-group">
            <label htmlFor="address.street">Street:</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Enter street"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address.suite">Suite:</label>
            <input
              type="text"
              id="address.suite"
              name="address.suite"
              value={formData.address.suite}
              onChange={handleChange}
              placeholder="Enter suite/apt"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address.city">City:</label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address.zipcode">Zipcode:</label>
            <input
              type="text"
              id="address.zipcode"
              name="address.zipcode"
              value={formData.address.zipcode}
              onChange={handleChange}
              placeholder="Enter zipcode"
            />
          </div>

          <h4 style={{color: '#1b5e20', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '1rem'}}>Company</h4>
          
          <div className="form-group">
            <label htmlFor="company.name">Company Name:</label>
            <input
              type="text"
              id="company.name"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company.catchPhrase">Catch Phrase:</label>
            <input
              type="text"
              id="company.catchPhrase"
              name="company.catchPhrase"
              value={formData.company.catchPhrase}
              onChange={handleChange}
              placeholder="Enter catch phrase"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company.bs">Business:</label>
            <input
              type="text"
              id="company.bs"
              name="company.bs"
              value={formData.company.bs}
              onChange={handleChange}
              placeholder="Enter business"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-submit">LƯU</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>HỦY</button>
          </div>
        </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;
