
// Product detail page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const productId = parseInt(getUrlParameter('id'));
    if (productId) {
        loadProductDetail(productId);
        loadRelatedProducts(productId);
    } else {
        // Redirect to products page if no ID
        window.location.href = 'products.html';
    }
});

function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    const container = document.getElementById('product-detail-content');
    if (!container) return;

    // Generate thumbnail images (using same image for demo)
    const thumbnails = Array(4).fill(product.image).map((img, index) => 
        `<img src="${img}" alt="Product view ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}')">`
    ).join('');

    // Generate nutrition table
    const nutritionRows = Object.entries(product.nutrition).map(([key, value]) => 
        `<tr><td>${key}</td><td>${value}</td></tr>`
    ).join('');

    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-gallery" data-aos="fade-right">
                <img src="${product.image}" alt="${product.name}" class="main-image" id="main-image">
                <div class="thumbnail-images">
                    ${thumbnails}
                </div>
            </div>
            
            <div class="product-info" data-aos="fade-left">
                <h1>${product.name}</h1>
                
                <div class="product-rating">
                    <div class="stars">★★★★★</div>
                    <span>(4.8/5 based on 124 reviews)</span>
                </div>
                
                <div class="product-price">$${product.price.toFixed(2)}</div>
                
                <p class="product-description">${product.description}</p>
                
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" class="quantity-input" id="quantity-input" value="1" min="1" max="10">
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                    <button class="btn btn-primary" onclick="addProductToCart()">Add to Cart</button>
                </div>
                
                <div class="nutrition-facts">
                    <h3>Nutrition Facts</h3>
                    <table class="nutrition-table">
                        ${nutritionRows}
                    </table>
                </div>
                
                <div class="product-features">
                    <h3>Key Features</h3>
                    <ul>
                        <li>✓ 100% Organic ingredients</li>
                        <li>✓ Third-party tested for purity</li>
                        <li>✓ Non-GMO and gluten-free</li>
                        <li>✓ Sustainable packaging</li>
                        <li>✓ 30-day money-back guarantee</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Update page title
    document.title = `${product.name} - EcoLife`;
}

function loadRelatedProducts(currentProductId) {
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return;

    // Get products from the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProductId)
        .slice(0, 3);

    const container = document.getElementById('related-products');
    if (!container) return;

    container.innerHTML = relatedProducts.map(product => `
        <div class="product-card fade-in" onclick="window.location.href='product.html?id=${product.id}'" data-aos="fade-up">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === imageSrc) {
            thumb.classList.add('active');
        }
    });
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity-input');
    if (!quantityInput) return;

    let currentQuantity = parseInt(quantityInput.value);
    const newQuantity = Math.max(1, Math.min(10, currentQuantity + delta));
    quantityInput.value = newQuantity;
}

function addProductToCart() {
    const productId = parseInt(getUrlParameter('id'));
    const quantity = parseInt(document.getElementById('quantity-input').value);
    
    if (productId && quantity > 0) {
        addToCart(productId, quantity);
    }
}

// Image gallery functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('thumbnail')) {
        const imageSrc = e.target.src;
        changeMainImage(imageSrc);
    }
});

// Quantity input validation
document.addEventListener('input', function(e) {
    if (e.target.id === 'quantity-input') {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 10) {
            e.target.value = 10;
        }
    }
});
