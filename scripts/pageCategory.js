import getGoods from "./service.js";

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




  // страница категорий

export default (hash) => {


  try {

    const goodsTitle = document.querySelector('.goods__title');
  const goodsList = document.querySelector('.goods__list');


  if (!goodsList) {
    throw 'This is not a goods page';
  }

  // Переключаю значение тайтла


  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };

  // заполнение страницы карточками
  const renderGoodsList = data => {
    goodsList.textContent = '';

    data.forEach((item, i) => {
      goodsList.append(createCard(item));
    });
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
};
