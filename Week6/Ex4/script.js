document.addEventListener('DOMContentLoaded', function() {
    // lay phan tu can thiet cho tim kiem
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    let productItems = document.querySelectorAll('.product-item'); // doi sang let de cap nhat

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
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        
        // format gia tien voi dau cham phan cach
        const formattedPrice = Number(productPrice).toLocaleString('vi-VN');
        
        // tao noi dung html
        newProduct.innerHTML = `
            <h3 class="product-name">${escapeHtml(productName)}</h3>
            <img src="${productImage || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                 alt="${escapeHtml(productName)}" 
                 width="300" 
                 height="300"
                 onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <p><strong>Mô tả:</strong> ${escapeHtml(productDesc) || 'Chưa có mô tả'}</p>
            <p><strong>Giá:</strong> ${formattedPrice} VNĐ</p>
            <button class="add-to-cart-btn">Thêm vào Giỏ hàng</button>
            <hr>
        `;
        
        // them san pham moi vao dau danh sach
        const productList = document.getElementById('productList');
        productList.prepend(newProduct);

        productItems = document.querySelectorAll('.product-item');
        
        // gan su kien cho nut gio hang cua san pham moi
        const newAddToCartBtn = newProduct.querySelector('.add-to-cart-btn');
        newAddToCartBtn.addEventListener('click', function() {
            addToCart(productName, formattedPrice + ' VNĐ');
        });

        // hien thong bao thanh cong
        showSuccessMessage('Đã thêm sản phẩm "' + productName + '" thành công!');
        
        // reset form va an
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        
        // scroll den san pham moi
        newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // them hieu ung highlight
        newProduct.style.animation = 'slideUp 0.8s ease-out';
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
    
    // su kien cho tat ca nut them vao gio hang co san
    const addToCartButtons = document.querySelectorAll('article button');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // lay thong tin tu article cha
            const article = this.closest('article');
            const productName = article.querySelector('.product-name').textContent;
            const priceElement = article.querySelector('p:last-of-type');
            const productPrice = priceElement.textContent.replace('Giá:', '').trim();
            
            addToCart(productName, productPrice);
        });
    });
    
    
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
