import { getLocalStorage, setLocalStorage } from "./localStorage.js";
import { deleteItemCart } from "./cart.js";
import  getGoods from "./service.js";

// страница товара

export default (hash) => {

try {

  if (!document.querySelector('.card-good')) {
    throw 'This is not a card-good page';
  }

  // получение элементов для дальнейшего вывода контента
  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodbuy = document.querySelector('.card-good__buy');

  // генерация дропдауна с параметрами
  const generateList = data => data.reduce((html, item, i) => html +
  `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');


  // вывод новых данных при открытии карточки товара
  const renderCardGood = ([{id, brand, name, cost, sizes, color, photo}]) => {
    const data = {brand, name, cost, id};


    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽` ;

    // генерация дропдауна
    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    } else {
      cardGoodColor.style.display = 'none';
    }

    // генерация дропдауна
    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    } else {
      cardGoodSizes.style.display = 'none';
    }

    // проверка, есть ли товар уже в корзине для изменения кнопки
    if (getLocalStorage().some(item => item.id === id)) {
      cardGoodbuy.classList.add('delete');
      cardGoodbuy.textContent = 'Удалить из корзины';
    }

    // клик по кнопке "добавить в корзину"
    cardGoodbuy.addEventListener('click', () => {
      // проверка для клика по "удлаить с корзины"
      // действия при удалении
      if (cardGoodbuy.classList.contains('delete')) {
        deleteItemCart(id);
        cardGoodbuy.classList.remove('delete');
        cardGoodbuy.textContent = 'Добавить в корзину';
        return;
      }
      // деймствия при добавлении
      if (color) data.color = cardGoodColor.textContent;
      if (sizes) data.size = cardGoodSizes.textContent;

      cardGoodbuy.classList.add('delete');
      cardGoodbuy.textContent = 'Удалить из корзины';

      // апдейт корзины
      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
  })
  };

  // открытие/закрытие дропдауна, смена контента при выборе нового пункта
  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', e => {
      let target = e.target;

      if (target.closest('.card-good__select')) {
        target.classList.toggle('card-good__select__open');
      }
      if (target.closest('.card-good__select-item')) {
        const cardGoodSelect = item.querySelector('.card-good__select');
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
        cardGoodSelect.classList.remove('card-good__select__open');
      }
    });
  });


  // получение конкретного товара + его вывод
  getGoods(renderCardGood, 'id', hash);

} catch (err) {
  console.warn(err);
}

}
