// dinh nghia duong dan den api endpoint (file json local)
// trong thuc te co the la url den rest api server
const API_URL = './users.json';
const USERS_PER_PAGE = 5;

// mang luu toan bo du lieu users tu api
let allUsers = [];
// mang luu du lieu users da loc theo tim kiem
let filteredUsers = [];
let currentPage = 1;
let editingUserId = null;

const elements = {
    tableBody: document.getElementById('tableBody'),
    searchInput: document.getElementById('searchInput'),
    addUserBtn: document.getElementById('addUserBtn'),
    userModal: document.getElementById('userModal'),
    userForm: document.getElementById('userForm'),
    modalTitle: document.getElementById('modalTitle'),
    closeModal: document.querySelector('.close'),
    cancelBtn: document.getElementById('cancelBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    loading: document.getElementById('loading'),
    notificationContainer: document.getElementById('notificationContainer')
};

// ham khoi tao app, goi khi dom loaded
// su dung async/await de xu ly cac tac vu bat dong bo
async function init() {
    try {
        // goi api de load du lieu ban dau
        await loadUsers();
        setupEventListeners();
    } catch (error) {
        showError('Khởi tạo ứng dụng thất bại: ' + error.message);
    }
}

function setupEventListeners() {
    elements.addUserBtn.addEventListener('click', () => openModal());
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    elements.userForm.addEventListener('submit', handleFormSubmit);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.prevBtn.addEventListener('click', () => changePage(-1));
    elements.nextBtn.addEventListener('click', () => changePage(1));
    
    elements.userModal.addEventListener('click', (e) => {
        if (e.target === elements.userModal) {
            closeModal();
        }
    });
}

// ham lay du lieu tu api endpoint
async function loadUsers() {
    try {
        showLoading(true);
        
        // su dung fetch api de gui http request
        // fetch tra ve mot promise chua response object
        const response = await fetch(API_URL);
        
        // kiem tra trang thai http response
        // response.ok tra ve true neu status code nam trong khoang 200-299
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // response.json() parse response body thanh javascript object
        // day cung la mot promise nen can await
        allUsers = await response.json();
        filteredUsers = [...allUsers];
        currentPage = 1;
        
        renderTable();
        updatePagination();
    } catch (error) {
        // bat loi neu fetch that bai (network error, parse json loi, etc)
        showError('Tải dữ liệu thất bại: ' + error.message);
        console.error('Error loading users:', error);
    } finally {
        showLoading(false);
    }
}

function renderTable() {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

    if (usersToDisplay.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    ${filteredUsers.length === 0 ? 'Không tìm thấy người dùng' : 'Không có người dùng ở trang này'}
                </td>
            </tr>
        `;
        return;
    }

    elements.tableBody.innerHTML = usersToDisplay.map(user => `
        <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.phone)}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">Sửa</button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    
    elements.pageInfo.textContent = `Trang ${currentPage} / ${totalPages || 1}`;
    elements.prevBtn.disabled = currentPage === 1;
    elements.nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
        updatePagination();
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredUsers = [...allUsers];
    } else {
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

function openModal(user = null) {
    editingUserId = user ? user.id : null;
    
    elements.modalTitle.textContent = user ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng';
    
    if (user) {
        document.getElementById('userName').value = user.name || '';
        document.getElementById('userUsername').value = user.username || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userWebsite').value = user.website || '';
        document.getElementById('userStreet').value = user.address?.street || '';
        document.getElementById('userCity').value = user.address?.city || '';
        document.getElementById('userCompany').value = user.company?.name || '';
    } else {
        elements.userForm.reset();
    }
    
    elements.userModal.classList.remove('hidden');
}

function closeModal() {
    elements.userModal.classList.add('hidden');
    elements.userForm.reset();
    editingUserId = null;
}

function validateForm(userData) {
    if (!userData.name || userData.name.length < 2) {
        throw new Error('Tên phải có ít nhất 2 ký tự');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
        throw new Error('Email không hợp lệ');
    }
    
    if (!userData.username || userData.username.length < 3) {
        throw new Error('Username phải có ít nhất 3 ký tự');
    }
    
    return true;
}

// ham xu ly khi submit form them/sua user
async function handleFormSubmit(e) {
    e.preventDefault();
    
    try {
        // thu thap du lieu tu form
        const userData = {
            name: document.getElementById('userName').value.trim(),
            username: document.getElementById('userUsername').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            website: document.getElementById('userWebsite').value.trim(),
            address: {
                street: document.getElementById('userStreet').value.trim(),
                city: document.getElementById('userCity').value.trim(),
                suite: '',
                zipcode: '',
                geo: { lat: '0', lng: '0' }
            },
            company: {
                name: document.getElementById('userCompany').value.trim(),
                catchPhrase: '',
                bs: ''
            }
        };
        
        // validate du lieu truoc khi gui request
        validateForm(userData);
        
        // goi api de tao hoac cap nhat user
        if (editingUserId) {
            await updateUser(editingUserId, userData);
        } else {
            await createUser(userData);
        }
        
        closeModal();
    } catch (error) {
        // hien thi loi neu validate hoac api call that bai
        showError(error.message || 'Lưu dữ liệu thất bại');
        console.error('Error saving user:', error);
    }
}

// ham gui request de tao user moi
// trong app thuc te se dung fetch hoac axios de gui post request len server
async function createUser(userData) {
    try {
        showLoading(true);
        
        // tao id moi cho user (trong thuc te server se tu tao)
        const newId = Math.max(...allUsers.map(u => u.id), 0) + 1;
        const newUser = { id: newId, ...userData };
        
        // gia lap api call voi settimeout thay vi fetch
        // trong thuc te se dung:
        // const response = await fetch(API_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newUser)
        // })
        // hoac dung axios:
        // const response = await axios.post(API_URL, newUser)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // cap nhat mang du lieu local (trong thuc te se lay tu response)
        allUsers.unshift(newUser);
        filteredUsers = [...allUsers];
        
        currentPage = 1;
        
        renderTable();
        updatePagination();
        
        showSuccess('Thêm người dùng thành công!');
    } catch (error) {
        throw error;
    } finally {
        showLoading(false);
    }
}

// ham gui request de cap nhat thong tin user
// trong app thuc te se dung fetch put/patch request hoac axios
async function updateUser(userId, userData) {
    try {
        showLoading(true);
        
        // gia lap api call
        // trong thuc te dung fetch:
        // await fetch(`${API_URL}/${userId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(userData)
        // })
        // hoac axios:
        // await axios.put(`${API_URL}/${userId}`, userData)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // cap nhat du lieu trong mang local
        const index = allUsers.findIndex(u => u.id === userId);
        if (index !== -1) {
            allUsers[index] = { ...allUsers[index], ...userData };
            
            const filteredIndex = filteredUsers.findIndex(u => u.id === userId);
            if (filteredIndex !== -1) {
                filteredUsers[filteredIndex] = { ...allUsers[index] };
            }
        }
        
        renderTable();
        updatePagination();
        
        showSuccess('Cập nhật người dùng thành công!');
    } catch (error) {
        throw error;
    } finally {
        showLoading(false);
    }
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        openModal(user);
    }
}

// ham gui request de xoa user
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        // gia lap api call xoa du lieu
        // trong thuc te dung fetch:
        // await fetch(`${API_URL}/${userId}`, {
        //   method: 'DELETE'
        // })
        // hoac axios:
        // await axios.delete(`${API_URL}/${userId}`)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // xoa user khoi mang local
        allUsers = allUsers.filter(u => u.id !== userId);
        filteredUsers = filteredUsers.filter(u => u.id !== userId);
        
        const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderTable();
        updatePagination();
        
        showSuccess('Xóa người dùng thành công!');
    } catch (error) {
        // xu ly loi khi api call that bai
        showError('Xóa người dùng thất bại: ' + error.message);
        console.error('Error deleting user:', error);
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = type === 'success' ? 'success-message' : 'error-message';
    notification.textContent = message;
    
    elements.notificationContainer.appendChild(notification);
    
    const duration = type === 'success' ? 3000 : 5000;
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
