console.log("E-Commerce Website Loaded");
// Select hamburger and nav menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle menu on click
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
// Fetch products from FakeStore API
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = ''; // Clear placeholder cards

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-to-cart">Add to Cart</button>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading products:', err));
  // Show loading state
const grid = document.querySelector('.product-grid');
grid.innerHTML = "<p>Loading products...</p>";

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => {
    displayProducts(products);
  })
  .catch(err => {
    grid.innerHTML = "<p>Error loading products. Please try again later.</p>";
    console.error("API Error:", err);
  });
  function displayProducts(products) {
  grid.innerHTML = ''; // Clear loading message

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <h3>${product.title}</h3>
      <p class="price">$${product.price}</p>
      <p class="desc">${product.description.substring(0, 60)}...</p>
      <button class="add-to-cart">Add to Cart</button>
    `;

    grid.appendChild(card);
  });
}
let cachedProducts = null;

if (cachedProducts) {
  displayProducts(cachedProducts);
} else {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      cachedProducts = products;
      displayProducts(products);
    });
}