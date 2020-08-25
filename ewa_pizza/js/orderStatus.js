import * as global from './global.js';

function init() {
	global.httpGetAsync('/ewa_pizza/server/getOrderStatus.php', 'client', constructTemplate);
}

function constructTemplate(data) {
	let CONTAINER = document.getElementsByClassName('bg-text')[0];
	while (CONTAINER.firstChild) {
		CONTAINER.removeChild(CONTAINER.firstChild);
	}
	data.forEach(element => {
		let divContaier = document.createElement('div');
		divContaier.className = 'pizzaStatus';
		// div pizzatext
		let divPizzaText = document.createElement('div');
		divPizzaText.className = 'pizzaText';
		//create pizza name span
		let pizzaNameSpan = document.createElement('span');
		pizzaNameSpan.className = 'pizzaName';
		pizzaNameSpan.textContent = element.name;
		// ordered span text
		let orderedSpanText = document.createElement('span');
		orderedSpanText.textContent = ' Bestellt ';
		// create ordered input
		let orderedInput = document.createElement('input');
		orderedInput.type = 'radio';
		orderedInput.name = 'pizza_' + element.pizza_id;
		orderedInput.value = 'notClickable';
		orderedInput.checked = element.baker_status === 'ordered';
		orderedInput.disabled = true;
		// in oven span text
		let ovenSpanText = document.createElement('span');
		ovenSpanText.textContent = ' Im Ofen ';
		//create in oven input
		let ovenInput = document.createElement('input');
		ovenInput.type = 'radio';
		ovenInput.name = 'pizza_' + element.pizza_id;
		ovenInput.value = 'notClickable';
		ovenInput.checked = element.baker_status === 'oven';
		ovenInput.disabled = true;
		//finish span text
		let finishSpanText = document.createElement('span');
		finishSpanText.textContent = ' Fertig ';
		//create finish input
		let finishInput = document.createElement('input');
		finishInput.type = 'radio';
		finishInput.name = 'pizza_' + element.pizza_id;
		finishInput.value = 'notClickable';
		finishInput.checked = element.baker_status === 'finish';
		finishInput.disabled = true;
		// on the way span text
		let onTheWaySpanText = document.createElement('span');
		onTheWaySpanText.textContent = ' Unterwegs ';
		// on the way input
		let onTheWayInput = document.createElement('input');
		onTheWayInput.type = 'radio';
		onTheWayInput.name = 'pizza_' + element.pizza_id;
		onTheWayInput.value = 'notClickable';
		onTheWayInput.checked = element.driver_status === 'onTheWay';
		onTheWayInput.disabled = true;
		// delivered span text
		let deliveredSpanText = document.createElement('span');
		deliveredSpanText.textContent = ' Ausgeliefert ';
		// delivered input
		let deliveredInput = document.createElement('input');
		deliveredInput.type = 'radio';
		deliveredInput.name = 'pizza_' + element.pizza_id;
		deliveredInput.value = 'notClickable';
		deliveredInput.checked = element.driver_status === 'delivered';
		deliveredInput.disabled = true;
		// br element
		let br = document.createElement('br');
		// contruct and append dom object
		divPizzaText.append(pizzaNameSpan, br.cloneNode(), orderedInput, orderedSpanText, br.cloneNode(), ovenInput, ovenSpanText, br.cloneNode(), finishInput,finishSpanText, br.cloneNode(), onTheWayInput,onTheWaySpanText, br.cloneNode(), deliveredInput,deliveredSpanText, br.cloneNode());
		divContaier.appendChild(divPizzaText);
		CONTAINER.append(divContaier, br.cloneNode());
	});
}

window.setInterval(init, 1000);
window.menu = global.menu;