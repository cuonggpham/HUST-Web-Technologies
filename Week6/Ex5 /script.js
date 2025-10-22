document.addEventListener('DOMContentLoaded', function() {
    // lay phan tu can thiet cho tim kiem
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    let productItems = document.querySelectorAll('.product-item'); // doi sang let de cap nhat
    
    // localstorage - quan ly du lieu san pham
    const STORAGE_KEY = 'products'; // key de luu tru
    
    // ham khoi tao san pham mac dinh
    function getDefaultProducts() {
        return [
            {
                name: 'Áo Đấu Sân Nhà Manchester United 2024/25',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/db1afe9e64d64518bd706b817ab2f11e_9366/Ao_djau_san_nha_chinh_hang_Manchester_United_mua_giai_25-26_DJo_JI7429_HM30.jpg',
                desc: 'Thiết kế cổ điển với tông màu đỏ chủ đạo. Chất liệu thoáng mát, thấm hút mồ hôi tốt.',
                price: 650000
            },
            {
                name: 'Áo Thun adidas Z.N.E.',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8a42b790bd1146aa957699c3ca2defda_9366/Ao_Thun_adidas_Z.N.E._Xam_JF2457_01_laydown.jpg',
                desc: 'Màu xám nổi bật, tượng trưng cho biển và bầu trời. Phù hợp cho cả tập luyện và cổ vũ.',
                price: 590000
            },
            {
                name: 'Áo Đấu Real Madrid Sân Nhà',
                image: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/68f433dd2a1141ffba47a66cfc82d1ff_9366/Ao_DJau_San_Nha_Real_Madrid_Mua_Giai_2025-2026_Chinh_Hang_trang_JV5918_HM30.jpg',
                desc: 'Phiên bản đặc biệt, màu trắng truyền thống với điểm nhấn vàng sang trọng. Hàng hiếm!',
                price: 720000
            }
        ];
    }
    
    // ham load san pham tu localstorage
    function loadProductsFromStorage() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                // parse json string thanh mang doi tuong
                return JSON.parse(storedData);
            } else {
                // neu chua co, khoi tao san pham mac dinh
                const defaultProducts = getDefaultProducts();
                saveProductsToStorage(defaultProducts);
                return defaultProducts;
            }
        } catch (error) {
            console.error('loi khi doc du lieu tu localstorage:', error);
            return getDefaultProducts();
        }
    }
    
    // ham luu san pham vao localstorage
    function saveProductsToStorage(products) {
        try {
            // chuyen mang thanh json string va luu
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            console.log('da luu ' + products.length + ' san pham vao localstorage');
        } catch (error) {
            console.error('loi khi luu du lieu vao localstorage:', error);
        }
    }
    
    // ham tao html cho mot san pham
    function createProductHTML(product) {
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        
        const article = document.createElement('article');
        article.className = 'product-item';
        article.innerHTML = `
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <img src="${product.image || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                 alt="${escapeHtml(product.name)}" 
                 width="300" 
                 height="300"
                 onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <p><strong>Mô tả:</strong> ${escapeHtml(product.desc) || 'Chưa có mô tả'}</p>
            <p><strong>Giá:</strong> ${formattedPrice} VNĐ</p>
            <button class="add-to-cart-btn">Thêm vào Giỏ hàng</button>
            <hr>
        `;
        
        // gan su kien cho nut gio hang
        const addToCartBtn = article.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            addToCart(product.name, formattedPrice + ' VNĐ');
        });
        
        return article;
    }
    
    // ham hien thi tat ca san pham tu localstorage
    function displayProductsFromStorage() {
        const products = loadProductsFromStorage();
        const productList = document.getElementById('productList');
        
        // xoa san pham hien tai
        productList.innerHTML = '';
        
        // tao va them san pham tu localstorage
        products.forEach(function(product) {
            const productElement = createProductHTML(product);
            productList.appendChild(productElement);
        });
        
        // cap nhat lai danh sach
        productItems = document.querySelectorAll('.product-item');
        console.log('da hien thi ' + products.length + ' san pham tu localstorage');
    }
    
    // goi ham hien thi san pham khi trang load
    displayProductsFromStorage();

    function searchProducts() {
        // lay gia tri input va chuyen ve chu thuong
        const searchTerm = searchInput.value.toLowerCase().trim();

        productItems.forEach(function(product) {
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            
            // kiem tra ten san pham co chua tu khoa khong
            if (productName.includes(searchTerm)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
        
        // hien thong bao neu khong tim thay
        checkNoResults();
    }
    
    function checkNoResults() {
        const visibleProducts = Array.from(productItems).filter(
            product => product.style.display !== 'none'
        );
        
        // xoa thong bao cu
        const oldMessage = document.getElementById('noResultsMessage');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // neu khong co san pham nao, them thong bao
        if (visibleProducts.length === 0) {
            const productList = document.getElementById('productList');
            const message = document.createElement('p');
            message.id = 'noResultsMessage';
            message.textContent = 'Khong tim thay san pham phu hop voi tu khoa "' + searchInput.value + '"';
            message.style.cssText = 'text-align: center; color: var(--text-secondary); font-size: 1.2rem; padding: 40px; grid-column: 1 / -1;';
            productList.appendChild(message);
        }
    }
    
    // gan su kien click cho nut tim kiem
    searchBtn.addEventListener('click', searchProducts);
    
    // su kien enter hoac realtime search
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        } else {
            searchProducts();
        }
    });
    
    // hien lai tat ca khi xoa noi dung tim kiem
    searchInput.addEventListener('input', function() {
        if (searchInput.value === '') {
            productItems.forEach(function(product) {
                product.style.display = '';
            });
            const oldMessage = document.getElementById('noResultsMessage');
            if (oldMessage) {
                oldMessage.remove();
            }
        }
    });
    
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductSection = document.getElementById('add-product-section');
    const addProductForm = document.getElementById('addProductForm');
    const cancelAddProductBtn = document.getElementById('cancelAddProduct');
    
    // ham toggle hien/an form
    function toggleAddProductForm() {
        // toggle de them/xoa class hidden
        addProductSection.classList.toggle('hidden');
        
        // scroll den form khi hien thi
        if (!addProductSection.classList.contains('hidden')) {
            addProductSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // gan su kien click cho nut them san pham
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    // gan su kien click cho nut huy
    cancelAddProductBtn.addEventListener('click', function() {
        // an form va reset
        addProductSection.classList.add('hidden');
        addProductForm.reset();
        
        // xoa thong bao loi neu co
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');
    });
    
    
    // gan su kien submit cho form
    addProductForm.addEventListener('submit', function(event) {
        // ngan hanh vi mac dinh (khong reload)
        event.preventDefault();

        // lay gia tri tu form
        const productName = document.getElementById('newProductName').value.trim();
        const productImage = document.getElementById('newProductImage').value.trim();
        const productDesc = document.getElementById('newProductDesc').value.trim();
        const productPrice = document.getElementById('newProductPrice').value.trim();
        const errorMsg = document.getElementById('errorMsg');

        // xoa thong bao loi cu
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');

        // validation - kiem tra du lieu
        // 1. kiem tra ten khong rong
        if (!productName) {
            showError('Tên sản phẩm không được để trống!');
            return;
        }

        // 2. kiem tra gia hop le va lon hon 0
        const priceValue = Number(productPrice);
        if (!productPrice || productPrice === '' || isNaN(priceValue) || priceValue <= 0) {
            showError('Giá phải là số hợp lệ và lớn hơn 0!');
            return;
        }

        // 3. kiem tra mo ta toi thieu 10 ky tu
        if (productDesc && productDesc.length < 10) {
            showError('Mô tả phải có ít nhất 10 ký tự!');
            return;
        }

        // 4. kiem tra url hinh anh hop le
        if (productImage && !isValidURL(productImage)) {
            showError('URL hình ảnh không hợp lệ!');
            return;
        }
        // tao doi tuong san pham moi
        const newProductData = {
            name: productName,
            image: productImage || 'https://via.placeholder.com/300x300?text=No+Image',
            desc: productDesc || 'Chưa có mô tả',
            price: Number(productPrice)
        };
        
        // load danh sach san pham hien tai tu localstorage
        const products = loadProductsFromStorage();
        
        // them san pham moi vao dau danh sach
        products.unshift(newProductData);
        
        // luu lai vao localstorage
        saveProductsToStorage(products);
        
        // hien thi lai tat ca san pham
        displayProductsFromStorage();
        
        // format gia tien de hien thi thong bao
        const formattedPrice = Number(productPrice).toLocaleString('vi-VN');

        // hien thong bao thanh cong
        showSuccessMessage('Đã thêm sản phẩm "' + productName + '" thành công!');
        
        // reset form va an
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        
        // scroll den san pham moi
        const firstProduct = document.querySelector('.product-item');
        if (firstProduct) {
            firstProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // them hieu ung highlight
            firstProduct.style.animation = 'slideUp 0.8s ease-out';
        }
    });
    
    // ham hien thong bao loi
    function showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '⚠️ ' + message;
        errorMsg.classList.remove('hidden');
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // ham hien thong bao thanh cong
    function showSuccessMessage(message) {
        // tao phan tu thong bao tam thoi
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✅ ' + message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            font-weight: 600;
        `;
        document.body.appendChild(successDiv);
        
        // tu dong xoa sau 3 giay
        setTimeout(function() {
            successDiv.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(function() {
                successDiv.remove();
            }, 500);
        }, 3000);
    }
    
    // ham kiem tra url hop le
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // ham escape html de tranh xss
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
    // xu ly them vao gio hang
    function addToCart(productName, productPrice) {
        alert('Da them "' + productName + '" vao gio hang!\nGia: ' + productPrice + ' VND');
    }
    
    // cap nhat su kien cho cac nut them vao gio hang
    // khong can thiet vi da xu ly trong createProductHTML
    
    // hieu ung hover cho cac nut
    const actionButtons = [searchBtn, addProductBtn];
    actionButtons.forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    console.log('javascript da khoi tao thanh cong');
    console.log('so san pham hien tai:', productItems.length);
});
