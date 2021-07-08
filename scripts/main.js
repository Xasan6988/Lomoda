const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const navLink = document.querySelectorAll('.navigation__link');

let hash = location.hash.substring(1);

// вывод города из локалки

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

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

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
};

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll();
};

// запрос базы данных

const getData = async () => {
  const data = await fetch('db.json');
  if (data.ok) {
    return data.json();
  } else {
    throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
  }
};

// получение товаров из БД
const getGoods = (callback, prop, value,) => {
  getData()
    .then(data => {
      if (value) {
        callback(data.filter(item => item[prop] === value));
      } else {
        callback(data);
      }
    })
    .catch(err => console.error(err));
};

// страница категорий

try {
  const goodsList = document.querySelector('.goods__list');
  const goodsTitle = document.querySelector('.goods__title');

  if (!goodsList || !goodsTitle) {
    throw 'This is not a goods page';
  }

// Переключаю значение тайтла

  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };

  // вывод товаров на страницу
  const createCard = ({id, preview, cost, brand, name, sizes}) => {
    const li = document.createElement('li');

    li.classList.add('goods__item');

    li.innerHTML = `
    <article class="good">
      <a class="good__link-img" href="card-good.html#${id}">
          <img class="good__img" src="goods-image/${preview}" alt="">
      </a>
      <div class="good__description">
          <p class="good__price">${cost} &#8381;</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
          ${sizes ?
            `<p class="good__sizes">Размеры (RUS):${sizes.join(' ')} <span   class="good__sizes-list"></span></p>`:
            ''}
          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
      </div>
    </article>
    `;

    return li;
  };


// заполнение страницы карточками
  const renderGoodsList = data => {
    goodsList.textContent = '';

    data.forEach((item, i) => {
      goodsList.append(createCard(item));
    })
  };

// ререндеринг при переходе по ссылке (смене хэша)
  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, 'category', hash);
    changeTitle(); // обновление тайтла страницы при смене категории
  });

  changeTitle();
  // получение товаров по категории + вывод на страницу
  getGoods(renderGoodsList, 'category', hash);

} catch (err) {
  console.warn(err);
}
// страница товара

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
  const renderCardGood = ([{brand, name, cost, sizes, color, photo}]) => {
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

// эвенты

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


// указание города + сохранение в локалку
headerCityButton.addEventListener('click', () => {
  const city = prompt('Укажите ваш город');
  if (city !== null) {
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
  }
  });


