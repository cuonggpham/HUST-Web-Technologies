// Tập tin JavaScript nâng cao cho Week6/Ex6
// Sử dụng Fetch API, async/await, hiệu ứng chuyển cảnh, và các tính năng nâng cao

document.addEventListener('DOMContentLoaded', async function() {
    // ==========================================
    // BIẾN TOÀN CỤC
    // ==========================================
    let allProducts = [];
    let displayedProducts = [];
    const STORAGE_KEY = 'products';
    let nextId = 9;
    
    // ==========================================
    // LẤY CÁC PHẦN TỬ DOM
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortOption = document.getElementById('sortOption');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductSection = document.getElementById('add-product-section');
    const addProductForm = document.getElementById('addProductForm');
    const cancelAddProductBtn = document.getElementById('cancelAddProduct');
    const productList = document.getElementById('productList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    
    // ==========================================
    // FETCH API - TẢI DỮ LIỆU
    // ==========================================
    async function fetchProductsFromJSON() {
        try {
            showLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const response = await fetch('./products.json');
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu');
            }
            
            const products = await response.json();
            console.log('✅ Đã tải', products.length, 'sản phẩm');
            return products;
        } catch (error) {
            console.error('❌ Lỗi:', error);
            showErrorToast('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.');
            return getDefaultProducts();
        } finally {
            showLoading(false);
        }
    }
    
    function getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Áo Đấu Manchester United 2024/25',
                category: 'CLB Anh',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/db1afe9e64d64518bd706b817ab2f11e_9366/Ao_djau_san_nha_chinh_hang_Manchester_United_mua_giai_25-26_DJo_JI7429_HM30.jpg',
                desc: 'Thiết kế cổ điển màu đỏ. Chất liệu thoáng mát.',
                price: 650000
            },
            {
                id: 2,
                name: 'Áo Thun adidas Z.N.E.',
                category: 'Áo Thun',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8a42b790bd1146aa957699c3ca2defda_9366/Ao_Thun_adidas_Z.N.E._Xam_JF2457_01_laydown.jpg',
                desc: 'Màu xám nổi bật. Phù hợp tập luyện.',
                price: 590000
            },
            {
                id: 3,
                name: 'Áo Đấu Real Madrid 2025',
                category: 'CLB Tây Ban Nha',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/68f433dd2a1141ffba47a66cfc82d1ff_9366/Ao_DJau_San_Nha_Real_Madrid_Mua_Giai_2025-2026_Chinh_Hang_trang_JV5918_HM30.jpg',
                desc: 'Màu trắng truyền thống. Hàng hiếm!',
                price: 720000
            }
        ];
    }
    
    // ==========================================
    // KHỞI TẠO DỮ LIỆU
    // ==========================================
    async function initializeProducts() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            
            if (storedData) {
                allProducts = JSON.parse(storedData);
                console.log('📦 Load từ localStorage:', allProducts.length);
            } else {
                allProducts = await fetchProductsFromJSON();
                saveProductsToStorage(allProducts);
            }
            
            if (allProducts.length > 0) {
                nextId = Math.max(...allProducts.map(p => p.id)) + 1;
            }
            
            displayedProducts = [...allProducts];
            renderProducts();
        } catch (error) {
            console.error('❌ Lỗi khởi tạo:', error);
        }
    }
    
    function saveProductsToStorage(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            console.log('💾 Đã lưu:', products.length, 'sản phẩm');
        } catch (error) {
            console.error('❌ Lỗi lưu:', error);
        }
    }
    
    // ==========================================
    // HIỂN THỊ SẢN PHẨM
    // ==========================================
    function renderProducts() {
        productList.innerHTML = '';
        
        if (displayedProducts.length === 0) {
            showNoResults();
            return;
        }
        
        displayedProducts.forEach(product => {
            const productElement = createProductCard(product);
            productList.appendChild(productElement);
        });
    }
    
    function createProductCard(product) {
        const article = document.createElement('article');
        article.className = 'product-item';
        article.dataset.productId = product.id;
        
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        
        article.innerHTML = `
            <div class="product-badge">${escapeHtml(product.category)}</div>
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <div class="product-image-container">
                <img src="${product.image || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                     alt="${escapeHtml(product.name)}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            </div>
            <p class="product-desc"><strong>Mô tả:</strong> ${escapeHtml(product.desc) || 'Chưa có'}</p>
            <p class="product-price"><strong>Giá:</strong> ${formattedPrice} VNĐ</p>
            <div class="product-actions">
                <button class="btn-primary add-to-cart-btn" data-id="${product.id}">
                    🛒 Thêm
                </button>
                <button class="btn-info view-detail-btn" data-id="${product.id}">
                    👁️ Chi tiết
                </button>
                <button class="btn-danger delete-product-btn" data-id="${product.id}">
                    🗑️ Xóa
                </button>
            </div>
        `;
        
        setTimeout(() => article.classList.add('fade-in'), 10);
        return article;
    }
    
    function showNoResults() {
        productList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa</p>
            </div>
        `;
    }
    
    // ==========================================
    // LỌC VÀ SẮP XẾP
    // ==========================================
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const priceRange = priceFilter.value;
        const sortBy = sortOption.value;
        
        let filtered = [...allProducts];
        
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                (p.desc && p.desc.toLowerCase().includes(searchTerm))
            );
        }
        
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
        
        if (sortBy) {
            filtered = sortProducts(filtered, sortBy);
        }
        
        displayedProducts = filtered;
        renderProducts();
    }
    
    function sortProducts(products, sortBy) {
        const sorted = [...products];
        switch(sortBy) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            default:
                return sorted;
        }
    }
    
    // ==========================================
    // FORM THÊM SẢN PHẨM VỚI HIỆU ỨNG
    // ==========================================
    function toggleAddProductForm() {
        const isHidden = addProductSection.style.maxHeight === '' || 
                        addProductSection.style.maxHeight === '0px';
        
        if (isHidden) {
            addProductSection.style.maxHeight = addProductSection.scrollHeight + 'px';
            addProductSection.style.opacity = '1';
            addProductSection.style.marginBottom = '40px';
            setTimeout(() => {
                addProductSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            addProductSection.style.maxHeight = '0';
            addProductSection.style.opacity = '0';
            addProductSection.style.marginBottom = '0';
            addProductForm.reset();
            clearError();
        }
    }
    
    async function handleAddProduct(event) {
        event.preventDefault();
        
        const formData = {
            id: nextId++,
            name: document.getElementById('newProductName').value.trim(),
            category: document.getElementById('newProductCategory').value,
            image: document.getElementById('newProductImage').value.trim(),
            desc: document.getElementById('newProductDesc').value.trim(),
            price: Number(document.getElementById('newProductPrice').value)
        };
        
        if (!validateProductData(formData)) return;
        
        try {
            showLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            allProducts.unshift(formData);
            saveProductsToStorage(allProducts);
            applyFilters();
            
            showSuccessMessage('Đã thêm sản phẩm thành công!');
            toggleAddProductForm();
            addProductForm.reset();
            
            setTimeout(() => {
                const newProduct = document.querySelector(`[data-product-id="${formData.id}"]`);
                if (newProduct) {
                    newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    newProduct.classList.add('highlight');
                    setTimeout(() => newProduct.classList.remove('highlight'), 2000);
                }
            }, 300);
        } catch (error) {
            console.error('❌ Lỗi:', error);
            showErrorToast('Có lỗi khi thêm sản phẩm');
        } finally {
            showLoading(false);
        }
    }
    
    function validateProductData(data) {
        clearError();
        
        if (!data.name) {
            showError('Tên sản phẩm không được để trống!');
            return false;
        }
        if (!data.category) {
            showError('Vui lòng chọn danh mục!');
            return false;
        }
        if (!data.price || data.price <= 0) {
            showError('Giá phải lớn hơn 0!');
            return false;
        }
        if (data.desc && data.desc.length < 10) {
            showError('Mô tả phải có ít nhất 10 ký tự!');
            return false;
        }
        if (data.image && !isValidURL(data.image)) {
            showError('URL hình ảnh không hợp lệ!');
            return false;
        }
        
        return true;
    }
    
    // ==========================================
    // XÓA SẢN PHẨM
    // ==========================================
    async function handleDeleteProduct(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        
        const confirmed = confirm(`Bạn có chắc muốn xóa "${product.name}"?`);
        if (!confirmed) return;
        
        try {
            showLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            allProducts = allProducts.filter(p => p.id !== productId);
            saveProductsToStorage(allProducts);
            applyFilters();
            
            showSuccessMessage('Đã xóa sản phẩm!');
        } catch (error) {
            console.error('❌ Lỗi:', error);
            showErrorToast('Có lỗi khi xóa sản phẩm');
        } finally {
            showLoading(false);
        }
    }
    
    // ==========================================
    // MODAL CHI TIẾT
    // ==========================================
    function showProductDetail(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="modal-product-detail">
                <div class="modal-product-image">
                    <img src="${product.image || 'https://via.placeholder.com/400x400?text=No+Image'}" 
                         alt="${escapeHtml(product.name)}">
                </div>
                <div class="modal-product-info">
                    <div class="modal-badge">${escapeHtml(product.category)}</div>
                    <h2>${escapeHtml(product.name)}</h2>
                    <p class="modal-price">${formattedPrice} VNĐ</p>
                    <div class="modal-desc">
                        <h3>📝 Mô tả sản phẩm</h3>
                        <p>${escapeHtml(product.desc) || 'Chưa có mô tả'}</p>
                    </div>
                    <div class="modal-features">
                        <h3>✨ Đặc điểm</h3>
                        <ul>
                            <li>✅ Chất liệu cao cấp</li>
                            <li>✅ Form áo thoải mái</li>
                            <li>✅ Logo chắc chắn</li>
                            <li>✅ Đủ size: S, M, L, XL, XXL</li>
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary btn-large" onclick="alert('Đã thêm vào giỏ!')">
                            🛒 Thêm vào giỏ
                        </button>
                        <button class="btn-secondary btn-large" onclick="alert('Liên hệ: 0936 363 363')">
                            📞 Liên hệ
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        productModal.style.display = 'flex';
        setTimeout(() => productModal.classList.add('show'), 10);
    }
    
    function closeProductModal() {
        productModal.classList.remove('show');
        setTimeout(() => {
            productModal.style.display = 'none';
        }, 300);
    }
    
    // ==========================================
    // GIỎ HÀNG
    // ==========================================
    function handleAddToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        
        showSuccessMessage(`Đã thêm "${product.name}" vào giỏ!`);
        console.log('🛒 Thêm vào giỏ:', product);
    }
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function showLoading(show) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
            productList.style.opacity = '0.5';
        } else {
            loadingIndicator.classList.add('hidden');
            productList.style.opacity = '1';
        }
    }
    
    function showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = '⚠️ ' + message;
            errorMsg.classList.remove('hidden');
            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    function clearError() {
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.classList.add('hidden');
        }
    }
    
    function showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <div class="toast-icon">✅</div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function showErrorToast(message) {
        alert('❌ ' + message);
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    sortOption.addEventListener('change', applyFilters);
    
    addProductBtn.addEventListener('click', toggleAddProductForm);
    cancelAddProductBtn.addEventListener('click', toggleAddProductForm);
    addProductForm.addEventListener('submit', handleAddProduct);
    
    productList.addEventListener('click', function(event) {
        const target = event.target;
        
        if (target.classList.contains('add-to-cart-btn')) {
            handleAddToCart(Number(target.dataset.id));
        }
        if (target.classList.contains('view-detail-btn')) {
            showProductDetail(Number(target.dataset.id));
        }
        if (target.classList.contains('delete-product-btn')) {
            handleDeleteProduct(Number(target.dataset.id));
        }
    });
    
    closeModal.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', function(event) {
        if (event.target === productModal) {
            closeProductModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && productModal.style.display === 'flex') {
            closeProductModal();
        }
    });
    
    // ==========================================
    // KHỞI TẠO
    // ==========================================
    addProductSection.style.maxHeight = '0';
    addProductSection.style.opacity = '0';
    addProductSection.style.overflow = 'hidden';
    addProductSection.style.transition = 'max-height 0.5s ease, opacity 0.3s ease, margin-bottom 0.3s ease';
    
    await initializeProducts();
    
    console.log('✅ Đã khởi tạo thành công!');
    console.log('📊 Tổng số sản phẩm:', allProducts.length);
});
