
// Products page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
    setupSorting();
});

function loadProducts(filter = 'all', sortBy = 'name') {
    const container = document.getElementById('products-grid');
    if (!container) return;

    let filteredProducts = products;
    
    // Apply filter
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sortBy);
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in" onclick="window.location.href='product.html?id=${product.id}'">
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

    // Add animation delay to cards
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value and reload products
            const filter = this.getAttribute('data-filter');
            const sortBy = document.getElementById('sort-select').value;
            loadProducts(filter, sortBy);
        });
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const activeFilter = document.querySelector('.filter-btn.active');
            const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            loadProducts(filter, this.value);
        });
    }
}

function sortProducts(products, sortBy) {
    const productsCopy = [...products];
    
    switch (sortBy) {
        case 'name':
            return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-high':
            return productsCopy.sort((a, b) => b.price - a.price);
        case 'newest':
            return productsCopy.sort((a, b) => b.id - a.id);
        default:
            return productsCopy;
    }
}

// Search functionality (if you want to add a search bar)
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No products found</h3>
                <p>Try adjusting your search terms or browse all products.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in" onclick="window.location.href='product.html?id=${product.id}'">
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
