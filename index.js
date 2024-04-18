// Настройка карточек
let settingsCard = {
	// URL получаемых данных
	URL: 'https://dummyjson.com/products',

	// Стили карточек
	cardStyle:
		'background-color: #fff;border-radius:20px;overflow:hidden;box-shadow:4px 4px 8px #151515bd;',

	// Стили изображения
	cardImg: 'height:200px;width:100%;display:block;object-fit:cover',

	// Стили заголовка
	cardTitle:
		'font-family:"Arial";font-weight:900;text-align: center;font-size:40px;margin: 20px 0;',

	// Стили текста
	cardText:
		'font-family:"Arial";font-weight:400;font-size:20px;margin: 0 20px 20px 20px;',
};
// Настройка слайдера
let settingsSlider = {
	// URL получаемых данных
	URL: 'https://dummyjson.com/products',

	// Стили карточек
	cardStyle:
		'background-color: #fff;border-radius:20px;overflow:hidden;position:relative',

	// Стили изображения
	cardImg: 'height:200px;width:100%;display:block;object-fit:cover',

	// Стили заголовка
	cardTitle:
		'font-family:"Arial";font-weight:900;text-align: center;font-size:40px;margin: 20px 0;color:red;text-decoration:underline',

	// Стили текста
	cardText:
		'font-family:"Arial";font-weight:400;font-size:20px;margin: 0 20px 20px 20px;',
};

// Индикатор загрузки
let asyngCount = 0;
const main = document.querySelector('.main');
main.style.display = 'none';

// Получаем список всех необходимых элементов
const listObject = document.querySelectorAll('.js');
listObject.forEach(object => {
	if (object.dataset.type == 'grid') {
		createGrid(object);
	} else if (object.dataset.type == 'slider') {
		createSlider(object);
	} else {
		alert('Проверьте написание атрибута type.');
	}
});

// Создание slider
async function createSlider(object) {
	asyngCount++;
	// Получаем data атрибуты
	const dataItems = object.dataset.items;
	const dataWidth = object.dataset.width;
	const dataHeight = object.dataset.height;

	// Получаем данные с сервера
	let contentList = await getData(dataItems, settingsSlider.URL);

	if (
		dataItems !== undefined &&
		dataWidth !== undefined &&
		dataHeight !== undefined
	) {
		// Если все ок, создаем slider
		const sliderContainer = document.createElement('ul');
		sliderContainer.style.cssText = `margin: 20px auto;height:${dataHeight}`;
		object.after(sliderContainer);

		let flagMove = false;
		let startX;
		let endX;
		let indexList = [];
		let flagScale = true;

		for (let i = 0; i < dataItems; i++) {
			let card = document.createElement('li');
			card.style.cssText =
				settingsSlider.cardStyle +
				`;width:${dataWidth};` +
				`height:${dataHeight}`;
			card.style.bottom = `${parseInt(dataHeight) * i}px`;
			if (flagScale) {
				card.style.scale = 1;
				card.style.boxShadow = '4px 4px 8px #151515bd';
				flagScale = false;
			} else {
				card.style.scale = 0.8;
			}
			card.style.zIndex = dataItems - i - 1;
			card.style.userSelect = 'none';
			indexList.unshift(i);

			card.addEventListener('mousedown', moveStart);
			card.addEventListener('mouseup', moveEnd);
			card.addEventListener('mousemove', move);

			function moveStart(e) {
				card.style.transition = 'none';
				startX = e.clientX;
				flagMove = true;
			}

			function move(e) {
				if (flagMove) {
					endX = e.clientX - startX;
					card.style.left = `${endX}px`;
				}
			}

			function moveEnd() {
				flagMove = false;
				card.style.transition = 'all 0.6s ease';
				card.style.left = `0px`;
				if (Math.abs(endX) > parseInt(dataWidth)) {
					card.style.scale = 0.8;
					card.style.boxShadow = 'none';
					let endList = indexList.pop();
					indexList.unshift(endList);

					let parentCard = card.parentNode;
					let cardList = parentCard.children;
					for (let i = 0; i < dataItems; i++) {
						cardList[i].style.zIndex = indexList[i];
						if (indexList[i] == dataItems - 1) {
							cardList[i].style.transition = 'scale 0.6s ease';
							cardList[i].style.boxShadow = '4px 4px 8px #151515bd';
							cardList[i].style.scale = 1;
						}
					}
				}
			}

			let img = document.createElement('img');
			img.style.cssText = settingsSlider.cardImg;
			img.setAttribute('src', `${contentList[i].images[0]}`);

			let title = document.createElement('h1');
			title.textContent = contentList[i].title;
			title.style.cssText = settingsSlider.cardTitle;

			let text = document.createElement('p');
			text.textContent = contentList[i].description;
			text.style.cssText = settingsSlider.cardText;

			card.append(img);
			card.append(title);
			card.append(text);
			sliderContainer.append(card);
		}
		asyngCount--;
		checkAsyng();
		object.remove();
	} else {
		alert('Проверьте напиcание атрибутов!');
		asyngCount--;
		checkAsyng();
		object.remove();
	}
}

// Создание grid сетки
async function createGrid(object) {
	asyngCount++;
	// Получаем data атрибуты
	const dataItems = object.dataset.items;
	const dataHorizontalItems = object.dataset.horizontalitems;
	const dataGap = object.dataset.gap;

	// Получаем данные с сервера
	let contentList = await getData(dataItems, settingsCard.URL);

	if (
		dataItems !== undefined &&
		dataHorizontalItems !== undefined &&
		dataGap !== undefined &&
		contentList.length !== 0
	) {
		// Если все ок, создаем грид сетку
		const gridContainer = document.createElement('ul');
		gridContainer.style.cssText = `display:grid;grid-template-columns:repeat(${dataHorizontalItems}, 1fr);gap:${dataGap}`;
		object.after(gridContainer);

		for (let i = 0; i < dataItems; i++) {
			let card = document.createElement('li');
			card.style.cssText = settingsCard.cardStyle;

			let img = document.createElement('img');
			img.style.cssText = settingsCard.cardImg;
			img.setAttribute('src', `${contentList[i].images[0]}`);

			let title = document.createElement('h1');
			title.textContent = contentList[i].title;
			title.style.cssText = settingsCard.cardTitle;

			let text = document.createElement('p');
			text.textContent = contentList[i].description;
			text.style.cssText = settingsCard.cardText;

			card.append(img);
			card.append(title);
			card.append(text);
			gridContainer.append(card);
		}
		asyngCount--;
		checkAsyng();
		object.remove();
	} else {
		if (contentList.length !== 0) {
			alert('Проверьте напиcание атрибутов!');
		}
		asyngCount--;
		checkAsyng();
		object.remove();
	}
}

// Получение данных с сервера
let flagErrorServer = true;
async function getData(items, URL) {
	try {
		const res = await fetch(URL);
		if (!res.ok) {
			throw new Error(res.status);
		}

		let data = await res.json();
		data = data.products;
		let newList = [];

		for (let i = 0; i < items; i++) {
			if (data[i] !== undefined) {
				newList.push(data[i]);
			} else {
				throw new Error('Выход за пределы данных с сервера.');
			}
		}
		return newList;
	} catch (error) {
		if (flagErrorServer) {
			alert('Произошла ошибка при работе с сервером: ' + error.message);
			flagErrorServer = false;
		}
		return [];
	}
}

// Проверка завершения работы
function checkAsyng() {
	if (asyngCount == 0) {
		const placeholder = document.querySelector('.placeholder');
		placeholder.style.display = 'none';
		main.style.display = 'flex';
	}
}
