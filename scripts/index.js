import { cartModalOpen, cartModalClose } from "./modal.js";
import { getLocalStorage } from "./localStorage.js";
import pageCategory from './pageCategory.js';
import pageCartGood from './pageCartGood.js';

let hash = location.hash.substring(1);
pageCategory(hash);
pageCartGood(hash);

const cartOverlay = document.querySelector('.cart-overlay');
const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');


// скрипт склонения слов
const declOfNum = (n, titles) => {
  return titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};


// обновление счётчика товаров НА корзине
export const updateCountGoodsCart = () => {
  let count = getLocalStorage().length;
  let arr = ['товар', 'товара', 'товаров'];
  if (count) {
    subheaderCart.textContent = count +  ' ' + declOfNum(count, arr);
  } else {
    subheaderCart.textContent = 'Корзина';
  }
}

updateCountGoodsCart();


// вывод города из локалки

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';


// эвенты
subheaderCart.addEventListener('click', () => {
  cartModalOpen(cartOverlay);
});

cartOverlay.addEventListener('click', e => {
  let target = e.target;
  if (target.matches('.cart-overlay') || target.matches('.cart__btn-close')) {
    cartModalClose(cartOverlay);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cartModalClose(cartOverlay);
  }
});


// указание города + сохранение в локалку
headerCityButton.addEventListener('click', () => {
  const city = prompt('Укажите ваш город');
  if (city !== null) {
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
  }
  });


