import { renderCart } from "./cart.js";
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

export const cartModalOpen = overlay => {
  overlay.classList.add('cart-overlay-open');
  disableScroll();
  renderCart();
};

export const cartModalClose = overlay => {
  overlay.classList.remove('cart-overlay-open');
  enableScroll();
};


