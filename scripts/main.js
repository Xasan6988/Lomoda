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


const getGoods = (callback, value) => {
  getData()
    .then(data => {
      if (value) {
        callback(data.filter(item => item.category === value));
      } else {
        callback(data);
      }
    })
    .catch(err => console.error(err));
};

try {
  const goodsList = document.querySelector('.goods__list');
  const goodsTitle = document.querySelector('.goods__title');

  if (!goodsList || !goodsTitle) {
    throw 'This is not a goods page';
  }

// Переключаю значение тайтла
  navLink.forEach(item => {
    item.addEventListener('click', e => {
      let target = e.target;
      goodsTitle.textContent = target.textContent;
    })
  })

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

    getGoods(renderGoodsList, hash);
  });

  getGoods(renderGoodsList, hash);

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

headerCityButton.addEventListener('click', () => {
  const city = prompt('Укажите ваш город');
  if (city !== null) {
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
  }
  });


