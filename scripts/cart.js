console.log("Cart Page Loaded");

// Initialize cart badge
updateCartBadge();

// Load cart items from localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById('checkoutBtn').disabled = true;
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-img">
      <div class="cart-info">
        <h3>${item.title}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
        <div class="quantity-row">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <input type="number" value="${item.qty}" min="1" readonly>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <p class="item-total">Item Total: $${(item.price * item.qty).toFixed(2)}</p>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  updateCartTotal();
  document.getElementById('checkoutBtn').disabled = false;
}

// Update quantity
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;

  cart[index].qty = Math.max(1, Number(cart[index].qty) + change);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
}

// Remove item
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
}

// Update total price
function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.querySelector('.badge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    badge.textContent = totalItems;
  }
}

// Buttons
document.getElementById('continueShopping').addEventListener('click', () => {
  window.location.href = 'index.html#product-grid';
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    window.location.href = 'checkout.html'; // placeholder
  }
});

// Load cart on page ready
loadCart();