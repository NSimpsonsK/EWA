import * as global from './global.js';

const pizzasConfig = [
	{
		name: 'Magharita',
		price: 7.60,
		img: '../img/content/Margherita.png',
		id: 'margharita'
	},
	{
		name: 'Hawaii',
		price: 7.4,
		img: '../img/content/Hawaii.png',
		id: 'hawaii'
	},
	{
		name: 'Salami',
		price: 4.5,
		img: '../img/content/salami.png',
		id: 'salami'
	},
	{
		name: 'Chicago',
		price: 3.75,
		img: '../img/content/chicago.png',
		id: 'chicago'
	},
	{
		name: 'New york',
		price: 4.5,
		img: '../img/content/new_york.png',
		id: 'new_york'
	},
	{
		name: 'Greek',
		price: 5.5,
		img: '../img/content/greek.png',
		id: 'greek'
	},
	{
		name: 'Bbq chicken',
		price: 10.2,
		img: '../img/content/bbq_chicken.png',
		id: 'bbq'
	},
	{
		name: 'Bacon',
		price: 8,
		img: '../img/content/bacon.png',
		id: 'bacon'
	},
	{
		name: 'Beef',
		price: 7,
		img: '../img/content/pizza_trad_beef.png',
		id: 'beef'
	},
	{
		name: '4 Käse',
		price: 5.5,
		img: '../img/content/4_fromaggi.png',
		id: '4_kaese'
	}
];


function createPizzaOrderView(pName) {
	'use strict';
	let container = document.createElement('div'),
		pizzaName = document.createElement('div'),
		pizzaQuantity = document.createElement('div'),
		pizzaButtonContainer = document.createElement('div'),
		pizzaDeleteButton = document.createElement('button'),
		numberOfOrders = this.nOfOrders;
	//add class and id attributes
	pizzaName.className = 'flex-item flex1';
	pizzaQuantity.className = 'flex-item flex2';
	pizzaButtonContainer.className = 'flex-item flex3';
	pizzaDeleteButton.className = 'deleteButton';
	container.className = 'flex-container';
	container.id = `order_${pName}`;
	//add button text
	pizzaDeleteButton.innerHTML = "Delete";
	//add inner html
	pizzaName.textContent = pName;
	pizzaQuantity.textContent = 1;
	//add delete button event listener
	pizzaDeleteButton.addEventListener('click', deleteButtonCallback);
	//append and add dom objects
	pizzaButtonContainer.appendChild(pizzaDeleteButton);
	container.appendChild(pizzaName);
	container.appendChild(pizzaQuantity);
	container.appendChild(pizzaButtonContainer);
	return container;
}

function updateOrderById(id) {
	'use strict';
	let order = document.getElementById(`order_${id}`);
	order.children.item(1).innerHTML = parseInt(order.children.item(1).innerHTML) + 1;

}

function deleteButtonCallback() {
	'use strict';
	let pizzaConfig = pizzasConfig.find(obj => { return obj.name === this.parentElement.parentElement.id.slice(6) });
	let pizzaContainerMenu = document.getElementById(`pizza_${pizzaConfig.id}`);
	updateSumPrice((pizzaConfig.price * pizzaContainerMenu.nOfOrders), 'dec');
	pizzaContainerMenu.nOfOrders = 0;
	this.parentElement.parentElement.remove();
}
function addPizzasToTheView() {
	'use strict';
	let pizzaContainer = document.getElementsByClassName('pizzaList');
	pizzasConfig.forEach(function (config) {
		let pizzaImage = document.createElement('img');
		let pizzaContent = document.createElement('div');
		let pizzaWrapper = document.createElement('div');
		pizzaWrapper.className = 'pizza';
		pizzaWrapper.id = `pizza_${config.id}`;
		pizzaImage.className = 'pizzaImage';
		pizzaContent.className = 'pizzaContent';
		pizzaImage.src = config.img;
		pizzaImage.style.width = '80px';
		pizzaImage.style.height = '80px';
		pizzaContent.innerHTML = `<span>${config.name}<br><br>${config.price.toFixed(2)} $</span>`;
		pizzaWrapper.append(pizzaImage, pizzaContent);
		pizzaContainer.item(0).appendChild(pizzaWrapper);
	});
}

function addEventListenerOnMenuItems() {
	'use strict';
	let pizzaItems = document.querySelectorAll('[id^=pizza_]'), // all element with a class that begins with pizza_
		pizzaSelectorContainer = document.getElementById('pizzaSelector');
	pizzaItems.forEach(function (element) {
		element.addEventListener('click', function (event) {
			if (typeof this.nOfOrders === 'undefined') this.nOfOrders = 0;
			++this.nOfOrders;
			const pizzaConf = pizzasConfig.find(obj => { return obj.id === event.target.id.slice(6) });
			// update the sum price
			updateSumPrice(pizzaConf.price, 'inc');
			if (this.nOfOrders === 1) {
				let pizzaOrder = createPizzaOrderView.call(this, pizzaConf.name);
				pizzaSelectorContainer.appendChild(pizzaOrder);
			} else {
				updateOrderById(pizzaConf.name);
			}
		});
	})
}

function updateSumPrice(price, tag) {
	'use strict';
	let priceContainer = document.getElementById('selectedItemPrice');
	switch (tag) {
		case 'inc': {
			priceContainer.innerHTML = (parseFloat(priceContainer.innerHTML) + price).toFixed(2);
			break;
		}
		case 'dec': {
			priceContainer.innerHTML = (parseFloat(priceContainer.innerHTML) - price).toFixed(2);
			break;
		}
		default:
			console.error('please enter a valid tag');
	}
}

function prepareOrder() {
	'use strict';
	document.getElementById('orderButton').addEventListener('click', function () {
		let orders = document.querySelectorAll('[id^=order_'), data = {},
			clientName = document.getElementById('name_input').value,
			clientAddress = document.getElementById('address_input').value;
		data.orders = [];
		data.orderer = {};
		data.price = 0;
		if (orders.length === 0 || clientName === "" || clientAddress === "") {
			showAlertBox();
			return;
		}
		orders.forEach(function (elem) {
			let order = {
				name: elem.childNodes.item(0).textContent,
				quantity: elem.childNodes.item(1).textContent,
			};
			data.orders.push(order);
		});
		data.orderer = {
			clientName,
			clientAddress
		};
		data.price = document.getElementById('selectedItemPrice').textContent;
		global.sendHttpPostRequest(data, '../server/createOrder.php').then((response) => {
			response = JSON.parse(response);
			let textOrder = 'Your ordered these pizzas: ';

			if (response.status === 'OK') {
				response.pizzas.forEach((element, index) => {
					textOrder += element + (index === response.pizzas.length - 1 ? '.' : ', ');
				});
				document.getElementById('orders_status').textContent = textOrder;
				showInfoBox();
			}
		});

	});
}
function hideAlertBox() {
	'use strict';
	document.getElementById('warning_input').style.display = 'none';
}
function hideInfoBox() {
	'use strict';
	document.getElementById('info-order').style.display = 'none';
}
function showInfoBox() {
	'use strict';
	document.getElementById('info-order').style.display = 'block';
}
function showAlertBox() {
	'use strict';
	document.getElementById('warning_input').style.display = 'block';
}

function init() {
	'use strict';
	addPizzasToTheView();
	addEventListenerOnMenuItems();
	prepareOrder();
	hideAlertBox();
	hideInfoBox();
	//expose hideAlertBox function
	window.hideAlertBox = hideAlertBox;
	window.hideInfoBox = hideInfoBox;
	window.menu = global.menu;
};
init();
