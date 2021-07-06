const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlayModal = document.querySelector('.cart-overlay');
const cartBtnClose = document.querySelector('.cart__btn-close');

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
	const city = prompt('Укажите ваш город');
	// проверка введен ли текст
	console.log(city);
	if (city.length > 0) {
		headerCityButton.textContent = city;
		localStorage.setItem('lomoda-location', city);
	}

});

const cardOpenModal = () => {
	cartOverlayModal.classList.add('cart-overlay-open');
};
const cardCloseModal = (event) => {
	cartOverlayModal.classList.remove('cart-overlay-open');
};

subheaderCart.addEventListener('click', cardOpenModal);

cartOverlayModal.addEventListener('click', event => {
	const target = event.target;
	// клик на крестик или на обёртку модалки (matches вместо lassList.contains(''))
	if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
		cardCloseModal();
	}
});

// закрытие по Escape
window.addEventListener('keydown', event => {
		if (event.key === 'Escape') cardCloseModal();
	},
	true,
);
