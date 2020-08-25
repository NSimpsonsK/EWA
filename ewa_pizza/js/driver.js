import * as global from './global.js';

function init() {
	global.httpGetAsync('/ewa_pizza/server/getOrderStatus.php', 'driver', constructTemplate);
}
function constructTemplate(data) {
	let CONTAINER = document.getElementsByClassName('bg-text')[0];
	//delete child nodes each time
	while (CONTAINER.firstChild) {
		CONTAINER.removeChild(CONTAINER.firstChild);
	}
	data.forEach(element => {
		// create div container
		let divContainer = document.createElement('div');
		divContainer.className = 'pizzaStatus';
		// driver text div
		let driverText = document.createElement('div');
		driverText.className = 'drivertext';
		// create client span
		let clientInfoSpan = document.createElement('span');
		clientInfoSpan.className = 'adress';
		clientInfoSpan.textContent = `${element.client.name}, ${element.client.address}`;
		// order span
		let orderSpan = document.createElement('span');
		orderSpan.className = 'orderedPizzas';
		const pizzalist = element.pizzas.map((x) => x.name);
		orderSpan.textContent = pizzalist.join(', ');
		// bold text
		let bold = document.createElement('b');
		// price text span
		let priceTextSpan = document.createElement('span'); //don't need to append it
		priceTextSpan.textContent = 'Preis: ';
		// price span
		let priceSpan = document.createElement('span'); // don't need to append it
		priceSpan.className = 'totalPrice';
		priceSpan.textContent = element.price + '$';
		// append childs to b tag
		bold.append(priceTextSpan, priceSpan);
		// baked text span
		let bakedTextspan = document.createElement('span');
		bakedTextspan.textContent = ' Gebacken ';
		// baked radio button
		let bakedRadioButton = document.createElement('input');
		bakedRadioButton.type = 'radio';
		bakedRadioButton.name = 'order_' + element.order_id;
		bakedRadioButton.value = 'baked';
		bakedRadioButton.checked = (function () {
			let returnedVal = true;
			element.pizzas.forEach(element => {
				if (element.driver_status !== 'baked')
					returnedVal = false;
			});
			return returnedVal;
		}());
		// on the way text span
		let onTheWayTextSpan = document.createElement('span');
		onTheWayTextSpan.textContent = ' Unterwegs ';
		// on the way radio button
		let onTheWayRadioButton = document.createElement('input');
		onTheWayRadioButton.type = 'radio';
		onTheWayRadioButton.name = 'order_' + element.order_id;
		onTheWayRadioButton.value = 'onTheWay';
		onTheWayRadioButton.checked = (function () {
			let returnedVal = true;
			element.pizzas.forEach(element => {
				if (element.driver_status !== 'onTheWay')
					returnedVal = false;
			});
			return returnedVal;
		}());
		//delivered text span
		let deliveredTextSpan = document.createElement('span');
		deliveredTextSpan.textContent = ' Ausgeliefert ';
		//delivered radio button
		let deliveredRadioButton = document.createElement('input');
		deliveredRadioButton.type = 'radio';
		deliveredRadioButton.name = 'order_' + element.order_id;
		deliveredRadioButton.value = 'delivered';
		deliveredRadioButton.checked = (function () {
			let returnedVal = true;
			element.pizzas.forEach(element => {
				if (element.driver_status !== 'delivered')
					returnedVal = false;
			});
			return returnedVal;
		}());
		//create br tag
		let br = document.createElement('br');
		//construct the template
		driverText.append(clientInfoSpan, br.cloneNode(), br.cloneNode(), orderSpan, br.cloneNode(), bold, br.cloneNode(), br.cloneNode(), bakedRadioButton, bakedTextspan, br.cloneNode(), onTheWayRadioButton, onTheWayTextSpan, br.cloneNode(), deliveredRadioButton, deliveredTextSpan, br.cloneNode());
		divContainer.appendChild(driverText);
		CONTAINER.append(divContainer, br.cloneNode());
	});
	addEventListenerToInputs();
}

function addEventListenerToInputs() {
	let radioButtons = Array.prototype.slice.call(document.getElementsByTagName('input'), 0);
	const responsible = 'driver';
	radioButtons.forEach((element) => {
		element.addEventListener('change', function (event) {
			console.log('event', event.target.value, this.name);
			let order_id = parseInt(this.name.split('_')[1]);
			let status = event.target.value;
			global.sendHttpPostRequest({
				order_id,
				responsible,
				status
			}, '/ewa_pizza/server/changeOrderStatus.php').then((response) => {
				console.log(JSON.parse(response));
			})
		});
	});
}


window.setInterval(init, 1000);
window.menu = global.menu;