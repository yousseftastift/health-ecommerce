
// Shopping cart page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
});

function loadCartItems() {
    const container = document.getElementById('cart-content');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" data-aos="fade-up">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="products.html" class="btn btn-primary">Shop Now</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="cart-items" data-aos="fade-up">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Premium organic product</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateItemQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeItemFromCart(${item.id})">Remove</button>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary" data-aos="fade-left">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${getCartSubtotal().toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${getShippingCost() === 0 ? 'FREE' : '$' + getShippingCost().toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${getTax().toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Total:</span>
                <span>$${getCartTotal().toFixed(2)}</span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="proceedToCheckout()">
                Proceed to Checkout
            </button>
            <button class="btn btn-secondary checkout-btn" onclick="continueShopping()">
                Continue Shopping
            </button>
        </div>
    `;
}

function updateItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeItemFromCart(productId);
    } else {
        updateCartQuantity(productId, newQuantity);
        loadCartItems();
        updateCartSummary();
    }
}

function removeItemFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && confirm(`Are you sure you want to remove ${item.name} from your cart?`)) {
        removeFromCart(productId);
        loadCartItems();
        updateCartSummary();
        showSuccessMessage('Item removed from cart');
    }
}

function updateCartSummary() {
    // This function updates the summary if it exists
    const summaryElements = document.querySelectorAll('.cart-summary');
    summaryElements.forEach(summary => {
        // Summary is updated in loadCartItems function
    });
}

function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getShippingCost() {
    const subtotal = getCartSubtotal();
    return subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
}

function getTax() {
    return getCartSubtotal() * 0.08; // 8% tax rate
}

function getCartTotal() {
    return getCartSubtotal() + getShippingCost() + getTax();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showErrorMessage('Your cart is empty');
        return;
    }
    
    // Store cart total for checkout page
    localStorage.setItem('checkoutTotal', getCartTotal().toFixed(2));
    window.location.href = 'checkout.html';
}

function continueShopping() {
    window.location.href = 'products.html';
}

// Apply coupon functionality
function applyCoupon() {
    const couponCode = document.getElementById('coupon-input')?.value.toUpperCase();
    const validCoupons = {
        'WELCOME10': 0.10,
        'SAVE20': 0.20,
        'FIRST15': 0.15
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        showSuccessMessage(`Coupon applied! You saved ${(discount * 100)}%`);
        // Update the display to show discount
        loadCartItems();
    } else {
        showErrorMessage('Invalid coupon code');
    }
}

// Save cart for later functionality
function saveForLater(productId) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        savedItems.push(item);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        removeFromCart(productId);
        loadCartItems();
        showSuccessMessage('Item saved for later');
    }
}

// Update cart count when page loads
updateCartCount();
