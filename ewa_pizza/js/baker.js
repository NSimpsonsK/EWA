import * as global from './global.js';
function init() {
	global.httpGetAsync('/ewa_pizza/server/getOrderStatus.php', 'baker', constructTemplate);
}

function constructTemplate(data) {
	let CONTAINER = document.getElementsByClassName('bg-text')[0];
	while (CONTAINER.firstChild) {
		CONTAINER.removeChild(CONTAINER.firstChild);
	}
	data.forEach(element => {
		//check if the element does't have to be shown
		if (element.baker_status === 'finish' || element.driver_status !== 'undefined')
			return;
		//create container div
		let divContainer = document.createElement('div');
		divContainer.className = 'pizzaStatus';
		// pizzatext span
		let pizzaTextDiv = document.createElement('div');
		pizzaTextDiv.className = 'pizzatext';
		//create info span
		let spanInfo = document.createElement('span');
		spanInfo.textContent = element.name + ' |Client n: ' + element.client_id;
		spanInfo.className = 'pizzaName';
		//create span 'Bestellt'
		let spanOrdered = document.createElement('span');
		spanOrdered.textContent = " Bestellt ";
		// create Input for 'Bestellt'
		let inputOrdered = document.createElement('input');
		inputOrdered.type = 'radio';
		inputOrdered.name = element.name + '_' + element.pizza_id;
		inputOrdered.value = 'ordered';
		inputOrdered.checked = element.baker_status === 'ordered';
		//create span 'Im Ofen'
		let spanOven = document.createElement('span');
		spanOven.textContent = ' Im Ofen ';
		//create Input for "Im Ofen"
		let inputOven = document.createElement('input');
		inputOven.type = 'radio'
		inputOven.name = element.name + '_' + element.pizza_id;
		inputOven.value = 'oven';
		inputOven.checked = element.baker_status === 'oven';
		//create span for 'fertig'
		let finishSpan = document.createElement('span');
		finishSpan.textContent = ' Fertig ';
		//create Input for 'fertig'
		let finishInput = document.createElement('input');
		finishInput.type = 'radio';
		finishInput.name = element.name + '_' + element.pizza_id;
		finishInput.value = 'finish';
		finishInput.checked = element.baker_status === 'finish';
		//create br element
		let br = document.createElement("br");

		//append childs to container
		pizzaTextDiv.append(spanInfo, br.cloneNode(), inputOrdered, spanOrdered, br.cloneNode(), inputOven, spanOven, br.cloneNode(), finishInput, finishSpan, br.cloneNode());
		divContainer.appendChild(pizzaTextDiv);
		CONTAINER.append(divContainer, br.cloneNode());
	});
	addEventListenerToInputs();
}

function addEventListenerToInputs() {
	let radioButtons = Array.prototype.slice.call(document.getElementsByTagName('input'), 0);
	const responsible = 'baker';
	radioButtons.forEach((element) => {
		element.addEventListener('change', function (event) {
			console.log('event', event.target.value, this.name);
			let pizza_id = parseInt(this.name.split('_')[1]);
			let status = event.target.value;
			global.sendHttpPostRequest({
				pizza_id,
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