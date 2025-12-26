console.log("Product Detail Page Loaded");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Select container
const container = document.getElementById('product-container');

// State
const variationState = { size: null, color: null };
const qtyState = { qty: 1, max: 5, unitPrice: 0 };

// Initialize cart badge on page load
updateCartBadge();

if (!productId) {
  container.innerHTML = "<p>No product selected. Please go back to products.</p>";
} else {
  container.innerHTML = "<p>Loading product details...</p>";

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      renderProduct(product);
      setupImageZoom();
      renderThumbnails(product);
      setupVariations();
      setupQuantityAndPrice(product);
      setupCart(product);
      updateAddToCartState();
    })
    .catch(err => {
      container.innerHTML = "<p>Error loading product details. Please try again later.</p>";
      console.error("API Error:", err);
    });
}

// Render product UI
function renderProduct(product) {
  container.innerHTML = `
    <div class="product-card-detail">
      <div>
        <div class="image-zoom">
          <img id="mainImage" src="${product.image}" alt="${product.title}" class="product-img">
          <div class="zoom-lens"></div>
        </div>
        <div class="thumbs" id="thumbs"></div>
      </div>

      <div class="product-info">
        <h1>${product.title}</h1>

        <div class="variations">
          <div class="variation-group">
            <label for="size">Size</label>
            <select id="size">
              <option value="" disabled selected>Select size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>

          <div class="variation-group">
            <span>Color</span>
            <div class="color-options" id="colorOptions">
              <button data-color="red" class="color-swatch" style="background:#e63939"></button>
              <button data-color="blue" class="color-swatch" style="background:#1e88e5"></button>
              <button data-color="black" class="color-swatch" style="background:#222"></button>
            </div>
          </div>
        </div>

        <div class="quantity-row">
          <button id="qtyMinus" class="qty-btn">−</button>
          <input id="qtyInput" type="number" value="1" min="1" max="5" readonly>
          <button id="qtyPlus" class="qty-btn">+</button>
        </div>

        <p class="price">
          <span id="unitPrice"></span>
          <span id="totalPrice" style="margin-left:10px; font-weight:600;"></span>
        </p>

        <p>${product.description}</p>

        <button class="add-to-cart" disabled>Add to Cart</button>
      </div>
    </div>
  `;
}

// Image zoom (tap-to-zoom on mobile)
function setupImageZoom() {
  const zoom = document.querySelector('.image-zoom');
  if (!zoom) return;
  zoom.addEventListener('click', () => {
    zoom.classList.toggle('active');
  });
}

// Thumbnails (mock multiple views using the same image)
function renderThumbnails(product) {
  const thumbs = document.getElementById('thumbs');
  if (!thumbs) return;
  const images = [product.image, product.image, product.image];
  thumbs.innerHTML = images.map((src, i) =>
    `<img src="${src}" alt="view ${i+1}" data-src="${src}" class="${i === 0 ? 'active' : ''}">`
  ).join('');

  const main = document.getElementById('mainImage');
  thumbs.addEventListener('click', (e) => {
    const t = e.target;
    if (t.tagName.toLowerCase() === 'img') {
      main.src = t.dataset.src;
      thumbs.querySelectorAll('img').forEach(img => img.classList.remove('active'));
      t.classList.add('active');
    }
  });
}

// Variations
function setupVariations() {
  const sizeSelect = document.getElementById('size');
  const colorOptions = document.getElementById('colorOptions');

  sizeSelect.addEventListener('change', (e) => {
    variationState.size = e.target.value;
    updateAddToCartState();
  });

  colorOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-swatch');
    if (!btn || btn.disabled) return;
    colorOptions.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    variationState.color = btn.dataset.color;
    updateAddToCartState();
  });
}

// Quantity + price
function setupQuantityAndPrice(product) {
  qtyState.unitPrice = product.price;

  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus  = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyInput');
  const unitPriceEl = document.getElementById('unitPrice');

  unitPriceEl.textContent = `$${product.price.toFixed(2)} / unit`;
  updateTotalPrice();

  qtyMinus.addEventListener('click', () => {
    if (qtyState.qty > 1) {
      qtyState.qty--;
      qtyInput.value = qtyState.qty;
      updateTotalPrice();
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (qtyState.qty < qtyState.max) {
      qtyState.qty++;
      qtyInput.value = qtyState.qty;
      updateTotalPrice();
    }
  });
}

function updateTotalPrice() {
  const total = qtyState.unitPrice * qtyState.qty;
  const totalPriceEl = document.getElementById('totalPrice');
  totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;
}

// Add to cart
function setupCart(product) {
  const cartBtn = document.querySelector('.add-to-cart');
  cartBtn.addEventListener('click', () => {
    if (qtyState.qty < 1) {
      showToast("Quantity must be at least 1");
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists (match by id + variation)
    const existingIndex = cart.findIndex(item =>
      item.id === product.id &&
      item.size === variationState.size &&
      item.color === variationState.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty = Number(cart[existingIndex].qty) + Number(qtyState.qty);
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: document.getElementById('mainImage').src,
        size: variationState.size,
        color: variationState.color,
        qty: Number(qtyState.qty)   // ✅ force numeric
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.title} added to cart!`);
  });
}

function updateAddToCartState() {
  const cartBtn = document.querySelector('.add-to-cart');
  cartBtn.disabled = !variationState.size; // require size; color optional
}

// Badge + toast
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.querySelector('.badge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    badge.textContent = totalItems;
  }
}

function showToast(msg) {
  const toast = document.getElementById('addedToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}