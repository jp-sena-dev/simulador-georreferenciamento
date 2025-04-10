import points from './points.js';

let HTMLs = [];
let previewId = '';
let selectedPreview;
let selectedPoint = points[0];
let animationInterval;

localStorage.setItem('selectedPoint', JSON.stringify(points[0]));

export function darkenColor(hex, diff = { r: 65, g: 69, b: 68 }) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.max(0, r - diff.r);
  const newG = Math.max(0, g - diff.g);
  const newB = Math.max(0, b - diff.b);

  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function configMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -15.789569443413834, lng:  -47.89637032850101 },
      zoom: 9.5,
  });



  points.forEach((p) => {
    const marker = new google.maps.Marker({
        position: p.location,
        map: map,
        title: p.name
    });

    const circle = new google.maps.Circle({
      strokeColor: '#FF0000', // Cor da borda
      strokeOpacity: 0.8, // Opacidade da borda
      strokeWeight: 0, // Espessura da borda
      fillColor: '#FF0000', // Cor de preenchimento
      fillOpacity: 0.35, // Opacidade do preenchimento
      map: map,
      center: p.location,
      radius: 2000, // Raio em metros (2 km)
    });

    marker.addListener('click', () => {
      createItensTable(Object.values(p.location));
    });
    circle.addListener('click', () => {
      createItensTable(Object.values(p.location));
    });
  });
}

function createProductTD(product, productIndex) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" value="${product.nameProduct}" class="w-full border-none outline-none product-name-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.price}" class="w-full border-none outline-none product-price-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.CTA}" class="w-full border-none outline-none product-CTA-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.location}" class="w-full border-none outline-none product-location-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.imgId}" class="w-full border-none outline-none product-image-Id-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.link}" class="w-full border-none outline-none product-link-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.background}" class="w-full border-none outline-none product-background-input" data-index="${productIndex}" /></td>
    <td><input type="text" value="${product.copy}" class="w-full border-none outline-none product-copy-input" data-index="${productIndex}" /></td>
    <td>
      <input list="unit" type="text" value="${product.unit}" class="w-full border-none outline-none product-unit-input" data-index="${productIndex}" />
      <datalist id="unit">
        <option value="kg">kg</option>
        <option value="Litros">Litros</option>
      </datalist>
    </td>
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
  const productImage = document.querySelectorAll('.product-image');
  const productUnit = document.querySelectorAll('.product-unit');
  const promotionImage = document.querySelectorAll('.promotion-image');
  const bannerPreview = document.querySelectorAll('.banner-preview');

  let index = 0;

  function updateContent() {
    const product = selectedPoint.products[index];

    productNames.forEach((el) => el.classList.remove('fade-cycle'));
    productPrices.forEach((el) => el.classList.remove('fade-cycle'));
    productImage.forEach((el) => el.classList.remove('fade-cycle'));
    if (index < selectedPoint.products.length - 1) {
      if (product.location !== selectedPoint.products[index].location) productLocations.forEach((el) => el.classList.remove('fade-cycle'));
      if (product.imgId !== selectedPoint.products[index].imgId) promotionImage.forEach((el) => el.classList.remove('fade-cycle'));
    }

    setTimeout(() => {
      promotionImage.forEach((el) => {
        if (product.imgId === '1') el.src = './assets/promotions/logo-promo.png';
        if (product.imgId === '2') el.src = './assets/promotions/logo-02.png';
        if (product.imgId === '3') el.src = './assets/promotions/logo-03.png';
        if (index < selectedPoint.products.length - 1) {
          if (product.imgId !== selectedPoint.products[index].imgId) el.classList.add('fade-cycle');
        };
      });

      bannerPreview.forEach((el) => {
        el.style.cssText = `background: ${product.background}; color: ${product.copy}`;
      });

      productNames.forEach((el) => {
        el.textContent = product.nameProduct;
        el.classList.add('fade-cycle');
      });

      productUnit.forEach((el) => {
        el.textContent = product.unit;
        if (index < selectedPoint.products.length - 1) {
          if (product.unit !== selectedPoint.products[index].unit) productUnit.forEach((el) => el.classList.add('fade-cycle'));
        }
        el.style.cssText = `background: ${product.darkBackground};`;
      });

      productLocations.forEach((el) => {
        el.textContent = product.location;
        if (index < selectedPoint.products.length - 1) {
          if (product.location !== selectedPoint.products[index].location) productLocations.forEach((el) => el.classList.add('fade-cycle'));
        };
      });

      productPrices.forEach((el) => {
        el.textContent = `${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', })}`;
        el.classList.add('fade-cycle');
      });

      productImage.forEach((el) => {
        el.src = product.image;
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
  localStorage.setItem('selectedPoint', JSON.stringify(selectedPoint));

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
  const UnitInputs = document.querySelectorAll('.product-unit-input');
  const linkInputs = document.querySelectorAll('.product-link-input');
  const imageIdInputs = document.querySelectorAll('.product-image-Id-input');
  const backgroundInputs = document.querySelectorAll('.product-background-input');
  const textInputs = document.querySelectorAll('.product-copy-input');

  UnitInputs.forEach((input, index) => {
    selectedPoint.products[index].unit = input.value;
  });

  imageIdInputs.forEach((input, index) => {
    selectedPoint.products[index].imgId = input.value;
  });

  linkInputs.forEach((input, index) => {
    selectedPoint.products[index].link = input.value;
  });

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

  backgroundInputs.forEach((input, index) => {
    selectedPoint.products[index].background = input.value;
    selectedPoint.products[index].darkBackground = darkenColor(input.value);
  });
  textInputs.forEach((input, index) => {
    selectedPoint.products[index].copy = input.value;
  });


  localStorage.setItem('selectedPoint', JSON.stringify(selectedPoint));

  modal.classList.remove('show');
  animationProducts();
}

function openModalPreview() {
  const modal = document.getElementById('modal-preview');
  const modalContent = document.getElementById('modal-preview-content');

  const scrollToTargetInsideIframe = (iframe) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const target = iframeDoc.getElementById(previewId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      console.error('Erro ao acessar o iframe:', e);
    }
  };

  (async () => {
    const iframes = document.querySelectorAll('.carousel-item');
    iframes.forEach((iframe, i) => {
      iframe.addEventListener('load', () => {
        if (i === 0) {
          scrollToTargetInsideIframe(iframe);
        }
      });
    });

    const carouselEl = document.getElementById('carouselExample');
    carouselEl.addEventListener('slid.bs.carousel', () => {
      const activeIframe = document.querySelector('.carousel-item.active');
      if (activeIframe) {
        scrollToTargetInsideIframe(activeIframe);
      }
    });
  })();

  const modalOverlay = document.getElementById('modal-preview');

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class') {
        const isVisible = modalOverlay.classList.contains('show');
        if (isVisible) {
          const activeIframe = document.querySelector('.carousel-item.active');
          if (activeIframe) {
            setTimeout(() => scrollToTargetInsideIframe(activeIframe), 200);
          }
        }
      }
    }
  });

  observer.observe(modalOverlay, { attributes: true });
  modal.classList.add('show');
}


function closeModalPreview() {
  const modal = document.getElementById('modal-preview');
  modal.classList.remove('show');
}

function start() {
  if (typeof google !== 'undefined') {
    configMap(); // carrega quando a API estiver disponível
  } else {
    // tenta novamente após pequeno delay
    const interval = setInterval(() => {
      if (typeof google !== 'undefined') {
        configMap();
        clearInterval(interval);
      }
    }, 100);
  }
  
  document.querySelectorAll('.mobile-preview').forEach((e) => e.addEventListener('click', () => {openModalPreview(); previewId = e.id}));
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

  (async () => {
    const metropolesRes = await fetch('./htmls/metropoles.html');
    const G1Res = await fetch('./htmls/g1.html');
    // const UolRes = await fetch('./htmls/oul.html');

    const metropolesHTML = await metropolesRes.text();
    const G1HTML = await G1Res.text();
    // const UolHTML = await UolRes.text();

    HTMLs = [metropolesHTML, G1HTML];
    iframes.forEach((iframe, i) => {
      iframe.srcdoc = HTMLs[i];
    });
  })();
  animationProducts();
}

document.addEventListener('DOMContentLoaded', start());
