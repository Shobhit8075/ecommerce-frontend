console.log("E-Commerce Website Loaded");

// Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Product grid
const grid = document.querySelector('.product-grid');

// Initialize cart badge
updateCartBadge();

// Loading state
grid.innerHTML = "<p>Loading products...</p>";

let cachedProducts = null;

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.querySelector('.badge');
  if (badge) badge.textContent = cart.length;
}

// Fetch products with caching
function fetchProducts() {
  if (cachedProducts) {
    displayProducts(cachedProducts);
    return;
  }
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      cachedProducts = products;
      displayProducts(products);
    })
    .catch(err => {
      grid.innerHTML = "<p>Error loading products. Please try again later.</p>";
      console.error("API Error:", err);
    });
}

// Render product cards with links
function displayProducts(products) {
  grid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <p class="price">$${product.price}</p>
      </a>
      <button class="add-to-cart">Add to Cart</button>
    `;
    // Add-to-cart from list
    card.querySelector('.add-to-cart').addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
    });

    grid.appendChild(card);
  });
}

fetchProducts();