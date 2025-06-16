
// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Update cart count
    updateCartCount();

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple email validation
            if (validateEmail(email)) {
                // Show success message
                showSuccessMessage('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                showErrorMessage('Please enter a valid email address.');
            }
        });
    }

    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
});

// Sample product data
const products = [
    {
        id: 1,
        name: "Organic Multivitamin",
        description: "Complete daily nutrition with organic ingredients",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1621485099116-dfc893e4f31d?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "supplements",
        featured: true,
        nutrition: {
            "Vitamin A": "500 IU",
            "Vitamin C": "60mg",
            "Vitamin D": "400 IU",
            "Vitamin E": "30 IU",
            "Calcium": "200mg",
            "Iron": "10mg"
        }
    },
    {
        id: 2,
        name: "Green Superfood Powder",
        description: "Nutrient-dense blend of organic greens and superfoods",
        price: 39.99,
        image: "https://plus.unsplash.com/premium_photo-1694116056845-6d859aba5b19?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "supplements",
        featured: true,
        nutrition: {
            "Spirulina": "1000mg",
            "Chlorella": "500mg",
            "Wheatgrass": "750mg",
            "Barley Grass": "500mg",
            "Spinach": "300mg",
            "Kale": "300mg"
        }
    },
    {
        id: 3,
        name: "Organic Trail Mix",
        description: "Premium mix of nuts, seeds, and dried fruits",
        price: 12.99,
        image: "https://plus.unsplash.com/premium_photo-1668677227454-213252229b73?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "snacks",
        featured: true,
        nutrition: {
            "Calories per serving": "160",
            "Total Fat": "12g",
            "Protein": "5g",
            "Carbohydrates": "8g",
            "Fiber": "3g",
            "Sugar": "4g"
        }
    },
    {
        id: 4,
        name: "Herbal Detox Tea",
        description: "Cleansing blend of organic herbs and botanicals",
        price: 24.99,
        image: "https://plus.unsplash.com/premium_photo-1731696604013-52ccf4c49bd9?q=80&w=507&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "beverages",
        featured: false,
        nutrition: {
            "Caffeine": "0mg",
            "Dandelion Root": "500mg",
            "Milk Thistle": "300mg",
            "Ginger Root": "200mg",
            "Turmeric": "150mg",
            "Lemon Balm": "100mg"
        }
    },
    {
        id: 5,
        name: "Omega-3 Fish Oil",
        description: "Pure, molecularly distilled fish oil capsules",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1693996047034-311ab7656691?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "supplements",
        featured: false,
        nutrition: {
            "EPA": "600mg",
            "DHA": "400mg",
            "Total Omega-3": "1000mg",
            "Fish Oil": "1400mg",
            "Vitamin E": "10 IU"
        }
    },
    {
        id: 6,
        name: "Organic Face Serum",
        description: "Nourishing serum with vitamin C and hyaluronic acid",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1748543668646-e81cda0890f3?q=80&w=746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "skincare",
        featured: false,
        nutrition: {
            "Vitamin C": "20%",
            "Hyaluronic Acid": "1%",
            "Niacinamide": "5%",
            "Vitamin E": "0.5%",
            "Aloe Vera": "10%"
        }
    }
];

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showSuccessMessage(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.filter(product => product.featured);
    
    container.innerHTML = featuredProducts.map(product => `
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

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message fade-in';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message fade-in';
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--error-color);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Export for use in other scripts
window.products = products;
window.cart = cart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
