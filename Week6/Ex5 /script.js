document.addEventListener('DOMContentLoaded', function() {
    // lay cac phan tu can thiet cho tim kiem
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    let productItems = document.querySelectorAll('.product-item'); // doi sang let de co the cap nhat

    function searchProducts() {
        // lay gia tri tu o input va chuyen ve chu thuong
        const searchTerm = searchInput.value.toLowerCase().trim();

        productItems.forEach(function(product) {
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            
            // kiem tra xem ten san pham co chua tu khoa tim kiem khong
            if (productName.includes(searchTerm)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
        
        // hien thi thong bao neu khong tim thay san pham nao
        checkNoResults();
    }
    
    function checkNoResults() {
        const visibleProducts = Array.from(productItems).filter(
            product => product.style.display !== 'none'
        );
        
        // xoa thong bao cu neu co
        const oldMessage = document.getElementById('noResultsMessage');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // neu khong co san pham nao hien thi, them thong bao
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
    
    // su kien Enter hoac realtime search khi nguoi dung nhap
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        } else {
            searchProducts();
        }
    });
    
    // hien thi lai tat ca san pham khi xoa noi dung tim kiem
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
    
    // ham toggle hien thi form
    function toggleAddProductForm() {
        //classList.toggle de them/xoa class "hidden"
        addProductSection.classList.toggle('hidden');
        
        // scroll den form khi hien thi
        if (!addProductSection.classList.contains('hidden')) {
            addProductSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // gan su kien click cho nut "Them san pham"
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    // gan su kien click cho nut "Huy" trong form
    cancelAddProductBtn.addEventListener('click', function() {
        // an form va reset form
        addProductSection.classList.add('hidden');
        addProductForm.reset();
        
        // Xoa thong bao loi neu co
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');
    });
    
    
    // gan su kien submit cho form them san pham
    addProductForm.addEventListener('submit', function(event) {
        // ngan chan hanh vi mac dinh cua form (khong reload trang)
        event.preventDefault();

        // Lay cac gia tri tu form
        const productName = document.getElementById('newProductName').value.trim();
        const productImage = document.getElementById('newProductImage').value.trim();
        const productDesc = document.getElementById('newProductDesc').value.trim();
        const productPrice = document.getElementById('newProductPrice').value.trim();
        const errorMsg = document.getElementById('errorMsg');

        // XOA THONG BAO LOI CU
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');

        // VALIDATION - KIEM TRA DU LIEU
        // 1. Kiem tra ten san pham khong duoc rong
        if (!productName) {
            showError('Tên sản phẩm không được để trống!');
            return;
        }

        // 2. Kiem tra gia phai la so hop le va lon hon 0
        const priceValue = Number(productPrice);
        if (!productPrice || productPrice === '' || isNaN(priceValue) || priceValue <= 0) {
            showError('Giá phải là số hợp lệ và lớn hơn 0!');
            return;
        }

        // 3. Kiem tra mo ta khong qua ngan (toi thieu 10 ky tu)
        if (productDesc && productDesc.length < 10) {
            showError('Mô tả phải có ít nhất 10 ký tự!');
            return;
        }

        // 4. Kiem tra URL hinh anh hop le (neu co nhap)
        if (productImage && !isValidURL(productImage)) {
            showError('URL hình ảnh không hợp lệ!');
            return;
        }
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        
        // Format gia tien voi dau cham phan cach hang nghin
        const formattedPrice = Number(productPrice).toLocaleString('vi-VN');
        
        // tao noi dung HTML cho san pham moi
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
        
        // them san pham moi vao DAU danh sach (prepend)
        const productList = document.getElementById('productList');
        productList.prepend(newProduct);

        productItems = document.querySelectorAll('.product-item');
        
        // Gan su kien cho nut "Them vao gio hang" cua san pham moi
        const newAddToCartBtn = newProduct.querySelector('.add-to-cart-btn');
        newAddToCartBtn.addEventListener('click', function() {
            addToCart(productName, formattedPrice + ' VNĐ');
        });

        // Hien thi thong bao thanh cong
        showSuccessMessage('Đã thêm sản phẩm "' + productName + '" thành công!');
        
        // Reset form va an form
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        
        // scroll den san pham moi vua them
        newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Them hieu ung highlight cho san pham moi
        newProduct.style.animation = 'slideUp 0.8s ease-out';
    });
    
    // Ham hien thi thong bao loi
    function showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '⚠️ ' + message;
        errorMsg.classList.remove('hidden');
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Ham hien thi thong bao thanh cong
    function showSuccessMessage(message) {
        // Tao phan tu thong bao tam thoi
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
        
        // Tu dong xoa sau 3 giay
        setTimeout(function() {
            successDiv.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(function() {
                successDiv.remove();
            }, 500);
        }, 3000);
    }
    
    // Ham kiem tra URL hop le
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // Ham escape HTML de tranh XSS
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
    
    // su kien cho tat ca nut "Them vao Gio hang" da co san
    const addToCartButtons = document.querySelectorAll('article button');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // lay thong tin san pham tu article cha
            const article = this.closest('article');
            const productName = article.querySelector('.product-name').textContent;
            const priceElement = article.querySelector('p:last-of-type');
            const productPrice = priceElement.textContent.replace('Giá:', '').trim();
            
            addToCart(productName, productPrice);
        });
    });
    
    
    // HIEU UNG HOVER CHO CAC NUT 
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
    
    console.log('JavaScript da duoc khoi tao thanh cong!');
    console.log('So san pham hien tai:', productItems.length);
});
