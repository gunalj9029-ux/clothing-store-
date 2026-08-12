document.addEventListener('DOMContentLoaded', () => {
    // State
    let cart = [];

    // DOM Elements
    const productGrid = document.getElementById('productGrid');
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const checkoutForm = document.getElementById('checkoutForm');

    // Handle Product Quantity Controls (+ / -) in the grid
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const qtySpan = e.target.parentElement.querySelector('.qty');
            let currentQty = parseInt(qtySpan.innerText);
            
            if (e.target.classList.contains('plus')) {
                currentQty++;
            } else if (e.target.classList.contains('minus') && currentQty > 1) {
                currentQty--;
            }
            qtySpan.innerText = currentQty;
        }

        // Add to Cart
        if (e.target.classList.contains('btn-add')) {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const image = card.querySelector('img').src;
            const qty = parseInt(card.querySelector('.qty').innerText);

            addToCart({ id, name, price, image, qty });
            
            // Visual feedback
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = 'Added!';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
            }, 1000);
            
            // Reset quantity on card
            card.querySelector('.qty').innerText = '1';
        }
    });

    // Cart Functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.qty += product.qty;
        } else {
            cart.push(product);
        }
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateCartUI() {
        // Update Count
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountEl.innerText = totalItems;

        // Update Items
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:2rem;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.qty}</p>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Update Total
        cartTotalEl.innerText = '₹' + total.toLocaleString('en-IN');
    }

    // Cart Remove Event
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            removeFromCart(id);
        }
    });

    // UI Toggles
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
    });

    closeCart.addEventListener('click', closeModals);
    overlay.addEventListener('click', closeModals);
    closeCheckout.addEventListener('click', closeModals);

    function closeModals() {
        cartSidebar.classList.remove('open');
        checkoutModal.classList.remove('open');
        overlay.classList.remove('active');
    }

    // Checkout Flow
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        cartSidebar.classList.remove('open');
        checkoutModal.classList.add('open');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        
        alert(`Thank you, ${name} from ${city}! Your order has been placed successfully.`);
        
        // Reset
        cart = [];
        updateCartUI();
        checkoutForm.reset();
        closeModals();
    });

    // Initial render
    updateCartUI();
});
