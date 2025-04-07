import points from './points.js';

let showModal = false;
let selectedPreview;
let selectedPoint = {};
let animationInterval;

function configMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -15.789569443413834, lng:  -47.89637032850101 },
      zoom: 9.5,
  });


  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; OpenStreetMap contributors'
  // }).addTo(map);
    


  points.forEach((p) => {
    const marker = new google.maps.Marker({
        position: p.location,
        map: map,
        title: p.name
    });

    // const marker = L.marker(p.location).addTo(map);
    
    // const circle = L.circle(p.location, {
    //     // color: "blue",
    //     fillColor: "blue",
    //     fillOpacity: 0.2,
    //     radius: 500 // Raio de 1km
    // }).addTo(map);

    const circle = new google.maps.Circle({
      strokeColor: '#FF0000', // Cor da borda
      strokeOpacity: 0.8, // Opacidade da borda
      strokeWeight: 0, // Espessura da borda
      fillColor: '#FF0000', // Cor de preenchimento
      fillOpacity: 0.35, // Opacidade do preenchimento
      map: map,
      center: p.location, // Centro do círculo
      radius: 2000, // Raio em metros (2 km)
    });

    marker.addListener('click', () => {
      createItensTable(Object.values(p.location));
    });
    circle.addListener('click', () => {
      createItensTable(Object.values(p.location));
    });
    // circle.on('click', () => {
    //   createItensTable(p.location)
    // });
  });
}

function createProductTD(product, productIndex) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" value="${product.nameProduct}" class="w-full border-none outline-none product-name-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.price.toFixed(2)}" class="w-full border-none outline-none product-price-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.CTA}" class="w-full border-none outline-none product-CTA-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.location}" class="w-full border-none outline-none product-location-input" data-index="${productIndex}" /></td>
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
    }, 250); // 5s
  }

  updateContent();

  if (animationInterval) clearInterval(animationInterval);
  animationInterval = setInterval(updateContent, 2500);
}

function createItensTable(location) {
  const tableContainer = document.getElementById('table');
  tableContainer.innerHTML = '';
  selectedPoint = points.find((point) => `${Object.values(point.location)}` === `${location}`);

  selectedPoint.products.forEach((product, index) => {
    createProductTD(product, index);
  });
  if (selectedPoint) {
    document.getElementById('open-table').classList.replace('hidden', 'block');
    document.getElementById('point-name').innerHTML = selectedPoint.name;
  }

  animationProducts();
}

function openModalTable() {
  const modal = document.getElementById('modal-table');

  modal.classList.add('show');
}

function closeModalTable() {
  const modal = document.getElementById('modal-table');

  const nameInputs = document.querySelectorAll('.product-name-input');
  const priceInputs = document.querySelectorAll('.product-price-input');
  const ctaInputs = document.querySelectorAll('.product-cta-input');
  const locationInputs = document.querySelectorAll('.product-location-input');

  nameInputs.forEach((input, index) => {
    selectedPoint.products[index].nameProduct = input.value;
  });

  priceInputs.forEach((input, index) => {
    selectedPoint.products[index].price = parseFloat(input.value);
  });

  ctaInputs.forEach((input, index) => {
    selectedPoint.products[index].CTA = input.value;
  });

  locationInputs.forEach((input, index) => {
    selectedPoint.products[index].location = input.value;
  });

  modal.classList.remove('show');
  animationProducts();
}

// async function openModalPreview() {
//   const HTMLs = await Promise.all([
//     fetch('./metropoles.html').then(res => res.text()),
//     fetch('./metropoles.html').then(res => res.text()), // simula G1
//     fetch('./metropoles.html').then(res => res.text())  // simula UOL
//   ]);

//   const carouselInner = document.getElementById('carousel-inner');

//   carouselInner.innerHTML = HTMLs.map((html, i) => `
//     <div class="carousel-item ${i === 0 ? 'active' : ''}">
//       <div class="p-4">${html}</div>
//     </div>
//   `).join('');

//   // Mostra o modal
//   const modal = new bootstrap.Modal(document.getElementById('modal-preview'));
//   modal.show();
// }

function openModalPreview() {
  let HTMLs = [];
  let indexPreview = 0;

  const modal = document.getElementById('modal-preview');
  const modalContent = document.getElementById('modal-preview-content');

  (async () => {
    const metropolesRes = await fetch('./metropoles.html');
    const G1Res = await fetch('./g1.html');
    const UolRes = await fetch('./oul.html');

    const metropolesHTML = await metropolesRes.text();
    const G1HTML = await G1Res.text();
    const UolHTML = await UolRes.text();

    HTMLs = [metropolesHTML, G1HTML, UolHTML];
    // modalContent.innerHTML = HTMLs[indexPreview];
    document.querySelectorAll('.carousel-item').forEach((e, i) => {
      e.srcdoc = HTMLs[i]
    });
  })();


  // carouselInner.innerHTML = HTMLs.map((html, i) => `
  //   <div class="carousel-item ${i === 0 ? 'active' : ''}">
  //     <div class="p-4">${html}</div>
  //   </div>
  // `).join('');

  // document.getElementById('prev-preview').addEventListener('click', () => {
  //   if (indexPreview > 0) {
  //     indexPreview -= 1;
  //     modalContent.innerHTML = HTMLs[indexPreview];
  //   }
  // });
  
  // document.getElementById('next-preview').addEventListener('click', () => {
  //   if (indexPreview < HTMLs.length - 1) {
  //     indexPreview += 1;
  //     modalContent.innerHTML = HTMLs[indexPreview];
  //   }
  // });

  modal.classList.add('show');
}


function closeModalPreview() {
  const modal = document.getElementById('modal-preview');
  document.querySelectorAll('.carousel-item').forEach((e, i) => {
    e.srcdoc = ''
  });
  modal.classList.remove('show');
}

function start() {
  // const addProcutButton = document.getElementById('add-product');
  // addProcutButton.addEventListener('click', addProduct());
  
  document.querySelectorAll('.mobile-preview').forEach((e) => e.addEventListener('click', openModalPreview));
  document.getElementById('overlay-click-close-preview').addEventListener('click', closeModalPreview);

  document.getElementById('open-table').addEventListener('click', openModalTable);
  document.getElementById('overlay-click-close-table').addEventListener('click', closeModalTable);
  selectedPreview = document.getElementById('Mobile');
  const iframes = document.querySelectorAll('iframe');
  const previewWrapper = document.getElementById('preview-wrapper');

  const previews = {
    Mobile: document.getElementById('Mobile-previews'),
    Desktop: document.getElementById('Desktop-previews')
  };
  
  document.querySelectorAll('.button-change-preview').forEach((button, index) => {
    if (index === 0) {
      button.classList.add('border-b-2', 'border-[#0D6AF4]', 'mb-[-2px]');
      selectedPreview = button;
      iframes.forEach((e) => e.classList.add('preview-size-mobile'));
      previewWrapper.classList.add('preview-size-mobile');
    }
    button.addEventListener('click', () => {
      if (selectedPreview !== button) {
        selectedPreview.classList.remove('border-b-2', 'border-[#0D6AF4]', 'mb-[-2px]');
        previews[selectedPreview.id].classList.add('hidden');
  
        selectedPreview = button;
        button.classList.add('border-b-2', 'border-[#0D6AF4]', 'mb-[-2px]');
        previews[button.id].classList.remove('hidden');

        if (button.id ==='Mobile') {
          iframes.forEach((e) => e.classList.replace('preview-size-desktop', 'preview-size-mobile'));
          previewWrapper.classList.replace('preview-size-desktop', 'preview-size-mobile');
        }

        if (button.id ==='Desktop') {
          iframes.forEach((e) => e.classList.replace('preview-size-mobile', 'preview-size-desktop'));
          previewWrapper.classList.replace('preview-size-mobile', 'preview-size-desktop');
        }
      }
    });
  });

  configMap();
}

document.addEventListener('DOMContentLoaded', start());
