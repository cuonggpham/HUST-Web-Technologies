document.addEventListener('DOMContentLoaded', function() {
    // lay phan tu can thiet cho tim kiem
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productItems = document.querySelectorAll('.product-item');

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
    });
    
    
    // gan su kien submit cho form
    addProductForm.addEventListener('submit', function(event) {
        // ngan hanh vi mac dinh (khong reload)
        event.preventDefault();

        const productName = document.getElementById('newProductName').value.trim();
        const productImage = document.getElementById('newProductImage').value.trim();
        const productDesc = document.getElementById('newProductDesc').value.trim();
        const productPrice = document.getElementById('newProductPrice').value.trim();

        if (!productName || !productPrice) {
            alert('Vui long dien day du thong tin bat buoc (Ten va Gia)!');
            return;
        }
        
        // tao article moi cho san pham
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        
        // tao noi dung html
        newProduct.innerHTML = `
            <h3 class="product-name">${productName}</h3>
            <img src="${productImage || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                 alt="${productName}" 
                 width="300" 
                 height="300"
                 onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <p><strong>Mô tả:</strong> ${productDesc || 'Chưa có mô tả'}</p>
            <p><strong>Giá:</strong> ${productPrice} VNĐ</p>
            <button class="add-to-cart-btn">Thêm vào Giỏ hàng</button>
            <hr>
        `;
        
        // them san pham moi vao danh sach
        const productList = document.getElementById('productList');
        productList.appendChild(newProduct);
        
        // gan su kien cho nut gio hang cua san pham moi
        const newAddToCartBtn = newProduct.querySelector('.add-to-cart-btn');
        newAddToCartBtn.addEventListener('click', function() {
            addToCart(productName, productPrice);
        });

        alert('Da them san pham "' + productName + '" thanh cong!');
        
        // reset form va an
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        
        // scroll den san pham moi
        newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // them hieu ung highlight
        newProduct.style.animation = 'slideUp 0.8s ease-out';
    });
    
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
