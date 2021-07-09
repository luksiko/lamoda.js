const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlayModal = document.querySelector('.cart-overlay');
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');

let hash = location.hash.substring(1);

// работа с localStorage
headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
const setLocalStorage = data => localStorage.setItem('cart-lomoda', JSON.stringify(data));

// отключение-включение скрола без прыжка
const disableScroll = () => {
	const widthScroll = window.innerWidth - document.body.offsetWidth;
	document.disableScroll = true;
	document.body.dbScrollY = window.scrollY;
	document.body.style.cssText = `
		position: fixed;
		top: ${window.scrollY}px;
		left: 0;
		width: 100%;
		overflow: hidden;
		padding-right: ${widthScroll}px;
	`;
};
const enableScroll = () => {
	document.disableScroll = true;
	document.body.style.cssText = '';
	window.scroll({top: document.body.dbScrollY});
};

const cardOpenModal = () => {
	renderCart();
	cartOverlayModal.classList.add('cart-overlay-open');
	disableScroll();
};
const cardCloseModal = () => {
	cartOverlayModal.classList.remove('cart-overlay-open');
	enableScroll();
};

// запрос базы данных
const getData = async () => {
	const data = await fetch('db.json');

	if (data.ok) {
		return data.json();
	} else {
		throw new Error(`Данные не были получены. Ошибка ${data.status} ${data.statusText}`);
	}
};

const getGoods = (callback, prop, value) => {
	getData()
		.then(data => {
			if (value) {
				callback(data.filter(item => item[prop] === value));
			} else {
				callback(data);
			}
		})
		.catch(err => {
			console.error(err);
		});
};

// рендер Корзины
const renderCart = () => {
	cartListGoods.textContent = '';

	const cartItems = getLocalStorage();
	let totalPrice = 0;
	cartItems.forEach((item, i) => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${i + 1}</td>
			<td>${item.brand} ${item.name}</td>
			${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
			${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
			<td>${item.cost} &#8381;</td>
			<td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
		`;
		totalPrice += item.cost;
		cartListGoods.append(tr);
	});
	cartTotalCost.textContent = totalPrice + ' ₽';
};

const deleteItemCart = id => {
	const cartItem = getLocalStorage();
	const newCartItems = cartItem.filter(item => {
		console.log(item);
		return item.id !== id;
	});
	setLocalStorage(newCartItems);
};

// goods
try {
	const goodsList = document.querySelector('.goods__list');
	const goodsTitle = document.querySelector('.goods__title');

	if (!goodsList) {
		throw 'This is not a goods page!';
	}

	// ищем ссылки с хэшем и берем текст
	const changeTitle = () => {
		goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
	};

	const createCard = ({id, preview, cost, brand, name, sizes}) => {

		const li = document.createElement('li');
		li.classList.add('goods__item');

		li.innerHTML = `
		<article class="good">
			<a class="good__link-img" href="card-good.html#id${id}">
				<img class="good__img" src="goods-image/${preview}" alt="photo: ${name}">
			</a>
			<div class="good__description">
				<p class="good__price">${cost} &#8381;</p>
				<h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
<!--		проверим есть ли размеры?		-->
			${sizes ?
			`<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`
			: ''}
				<a class="good__link" href="card-good.html#id56454">Подробнее</a>
			</div>
		</article>
		`;

		return li;
	};

	const renderGoodsList = data => {

		goodsList.textContent = '';
		data.forEach(item => {
			const card = createCard(item);
			goodsList.append(card);
		});
	};

	window.addEventListener('hashchange', () => {
		hash = location.hash.substring(1);
		changeTitle();
		getGoods(renderGoodsList, 'category', hash);
	});
	changeTitle();
	getGoods(renderGoodsList, 'category', hash);

} catch (err) {
	console.warn(err);
}

// card Good page
try {
	if (!document.querySelector('.card-good')) {
		throw 'This is not a card-good page!';
	}

	let goodId = location.hash.substring(3);
	const cardGoodImage = document.querySelector('.card-good__image');
	const cardGoodBrand = document.querySelector('.card-good__brand');
	const cardGoodTitle = document.querySelector('.card-good__title');
	const cardGoodPrice = document.querySelector('.card-good__price');
	const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
	const cardGoodColor = document.querySelector('.card-good__color');
	const cardGoodColorList = document.querySelector('.card-good__color-list');
	const cardGoodSizes = document.querySelector('.card-good__sizes');
	const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
	const cardGoodBuy = document.querySelector('.card-good__buy');

	//создаем элементы перебором, складываем друг с другом
	const generateList = data => data.reduce((html, item, i) => html +
		`<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

	const renderCardGood = ([{id, photo, color, sizes, brand, cost, name}]) => {
		// const {photo, color, sizes, brand, cost, name} = data[0];
		const data = {id, cost, brand, name};

		cardGoodImage.src = `goods-image/${photo}`;
		cardGoodImage.alt = `${brand} ${name}`;
		cardGoodBrand.textContent = brand;
		cardGoodTitle.textContent = name;
		cardGoodPrice.textContent = `${cost} ₽`;
		if (color) {
			cardGoodColor.textContent = color[0];
			cardGoodColor.dataset.id = 0;
			cardGoodColorList.innerHTML = generateList(color);
		} else {
			cardGoodColor.style.display = 'none';
		}
		if (sizes) {
			cardGoodSizes.textContent = sizes[0];
			cardGoodSizes.dataset.id = 0;
			cardGoodSizesList.innerHTML = generateList(sizes);
		} else {
			cardGoodSizes.style.display = 'none';
		}

		if (getLocalStorage().some(item => item.id === id)) {
			cardGoodBuy.classList.add('delete');
			cardGoodBuy.textContent = 'Удалить из корзины';
		}

		// добавление данных в корзину
		cardGoodBuy.addEventListener('click', () => {
			if (cardGoodBuy.classList.contains('delete')) {
				deleteItemCart(id);
				cardGoodBuy.classList.remove('delete');
				cardGoodBuy.textContent = 'Добавить в корзину';
				return;
			}

			if (color) data.color = cardGoodColor.textContent;
			if (sizes) data.size = cardGoodSizes.textContent;

			cardGoodBuy.classList.add('delete');
			cardGoodBuy.textContent = 'Удалить из корзины';

			const cartData = getLocalStorage();
			cartData.push(data);
			setLocalStorage(cartData);
		});
	};

	cardGoodSelectWrapper.forEach(item => {
		item.addEventListener('click', (event) => {
			const target = event.target;
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

	getGoods(renderCardGood, 'id', goodId);

} catch (err) {
	console.warn(err);
}


cartListGoods.addEventListener('click', ({target}) => {
	if (target.matches('.btn-delete')) {
		deleteItemCart(target.dataset.id);
		renderCart();
	}
});


headerCityButton.addEventListener('click', () => {
	const city = prompt('Укажите ваш город');
	// проверка введен ли текст
	if (city.length > 0) {
		headerCityButton.textContent = city;
		localStorage.setItem('lomoda-location', city);
	}
});

subheaderCart.addEventListener('click', cardOpenModal);

cartOverlayModal.addEventListener('click', event => {
	const target = event.target;
	// клик на крестик или на обёртку корзины (matches вместо lassList.contains(''))
	if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
		cardCloseModal();
	}
});

// закрытие по Escape
window.addEventListener('keydown', event => {
	if (event.key === 'Escape') cardCloseModal();
});
