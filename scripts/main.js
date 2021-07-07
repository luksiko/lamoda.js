const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlayModal = document.querySelector('.cart-overlay');

let hash = location.hash.substring(1);

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
	const city = prompt('Укажите ваш город');
	// проверка введен ли текст
	if (city.length > 0) {
		headerCityButton.textContent = city;
		localStorage.setItem('lomoda-location', city);
	}
});

const cardOpenModal = () => {
	cartOverlayModal.classList.add('cart-overlay-open');
};
const cardCloseModal = () => {
	cartOverlayModal.classList.remove('cart-overlay-open');
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

const getGoods = (callback, value) => {
	getData()
		.then(data => {
			if (value) {
				callback(data.filter(item => item.category === value));
			} else {
				callback(data);
			}
		})
		.catch(err => {
			console.error(err);
		});
};

const getGood = (callback, value) => {
	getData()
		.then(data => {
			if (value) {
				callback(data.filter(item => item.id === value));
			} else {
				callback(data);
			}
		})
		.catch(err => {
			console.error(err);
		});
};

// goods
try {
	const goodsList = document.querySelector('.goods__list');

	if (!goodsList) {
		throw 'This is not a goods page!';
	}

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
		const goodsTitle = document.querySelector('.goods__title');
		const navList = document.querySelector('.navigation__list');

		goodsList.textContent = '';
		data.forEach(item => {
			const card = createCard(item);
			goodsList.append(card);
		});

		navList.addEventListener('click', (event) => {
			goodsTitle.textContent = event.target.text;
		});
	};

	window.addEventListener('hashchange', () => {
		hash = location.hash.substring(1);
		getGoods(renderGoodsList, hash);
	});
	getGoods(renderGoodsList, hash);

} catch (err) {
	console.warn(err);
}


// card Good page
try {
	const cardGood = document.querySelector('.card-good');
	if (!cardGood) {
		throw 'This is not a card-good page!';
	}


	let goodId = location.hash.substring(3);

	const renderGood = (data) => {
		const {photo, color, sizes, brand, cost, name} = data[0];
		const cardGoodImage = document.querySelector('.card-good__image');
		console.log(data);
		cardGoodImage.src = `goods-image/${photo}`;


	};

	getGood(renderGood, goodId);

} catch (err) {
	console.warn(err);
}

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
});
