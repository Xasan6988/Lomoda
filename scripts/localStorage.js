// работа с данными корзины в локалке

export const getLocalStorage = () => JSON.parse(localStorage.getItem('cart-lomoda')) || [];


export const setLocalStorage = data => localStorage.setItem('cart-lomoda', JSON.stringify(data));

