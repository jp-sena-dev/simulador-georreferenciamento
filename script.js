import points from './points.js';

let selectedPoint = {};
let animationInterval;

function configMap() {
  const map = L.map('map').setView([-15.81476747189544, -48.01330789905051], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
    


  points.forEach((p) => {
    const marker = L.marker(p.location).addTo(map);
    
    const circle = L.circle(p.location, {
        // color: "blue",
        fillColor: "blue",
        fillOpacity: 0.2,
        radius: 500 // Raio de 1km
    }).addTo(map);

    marker.on('click', () => {
      createItensTable(p.location)
    });
    circle.on('click', () => {
      createItensTable(p.location)
    });
  });
}

function createProductTD(product, productIndex) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" value="${product.nameProduct}" class="w-full border-none outline-none product-name-input" data-index="${productIndex}" /></td>
    <td>R$ ${product.price.toFixed(2)}</td>
    <td>${product.CTA}</td>
    <td>${product.location}</td>
  `;

  document.getElementById('table').appendChild(row);

  row.querySelector('.product-name-input').addEventListener('input', (event) => {
    const index = event.target.dataset.index;
    selectedPoint.products[index].nameProduct = event.target.value;
  });
}

function animationProducts() {
  const productNames = document.querySelectorAll('.product-name');
  const productLocations = document.querySelectorAll('.product-location');
  const productPrices = document.querySelectorAll('.product-price');

  let index = 0;

  function updateContent() {
    const product = selectedPoint.products[index];

    productNames.forEach((el) => el.classList.remove('fade-cycle'));
    productLocations.forEach((el) => el.classList.remove('fade-cycle'));
    productPrices.forEach((el) => el.classList.remove('fade-cycle'));

    setTimeout(() => {
      productNames.forEach((el) => {
        el.textContent = product.nameProduct;
        el.classList.add('fade-cycle');
      });

      productLocations.forEach((el) => {
        el.textContent = product.location;
        el.classList.add('fade-cycle');
      });

      productPrices.forEach((el) => {
        el.textContent = `R$ ${product.price.toFixed(2)}`;
        el.classList.add('fade-cycle');
      });

      index = (index + 1) % selectedPoint.products.length;
    }, 500); // 5s
  }

  updateContent();

  if (animationInterval) clearInterval(animationInterval);
  animationInterval = setInterval(updateContent, 5000);
}

function createItensTable(location) {
  const tableContainer = document.getElementById('table');
  tableContainer.innerHTML = '';
  selectedPoint = points.find((point) => `${point.location}` === `${location}`);

  selectedPoint.products.forEach((product, index) => {
    createProductTD(product, index);
  });
  if (selectedPoint) document.getElementById('add-product').classList.replace('hidden', 'block');

  animationProducts();
}

function addProduct() {
  console.log(' as')
}

function start() {
  const addProcutButton = document.getElementById('add-product');
  addProcutButton.addEventListener('click', addProduct());
  
  let selectedPreview = null;
  document.querySelectorAll('.button-change-preview').forEach((button) => {
    button.addEventListener('click', () => {
      if (selectedPreview) {
        selectedPreview.classList.remove('border-b-2', 'border-[#0D6AF4]', 'mb-[-2px]');
      }
      selectedPreview = button;
      button.classList.add('border-b-2', 'border-[#0D6AF4]', 'mb-[-2px]');
    });
  });



  configMap();
}

document.addEventListener('DOMContentLoaded', start());
