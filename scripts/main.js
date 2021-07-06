const headerCityButton = document.querySelector('.header__city-button');


headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';


headerCityButton.addEventListener('click', () => {
  const city = prompt('Укажите ваш город');
  if (city !== null) {
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
  }
  });

// блокировка скрола
const disableScroll = () => {
  document.body.dataset.scrollY = window.scrollY;

  const scrollWidth = window.innerWidth - document.body.offsetWidth;

  document.body.style.cssText = `
  overflow:hidden;
  top:-${window.scrollY}px;
  left:0;
  width:100%;
  position:fixed;
  height:100vh;
  padding-right: ${scrollWidth}px;
  `;
};

const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dataset.scrollY,
  })
};


// модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
};

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll();
};

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', e => {
  let target = e.target
  if (target.matches('.cart-overlay') || target.matches('.cart__btn-close')) {
    cartModalClose();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cartModalClose();
  }
});
