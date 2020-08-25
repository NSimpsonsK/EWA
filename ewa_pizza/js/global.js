function sendHttpPostRequest(payload, url) {
	return new Promise((resolve, reject) => {
		const http = new XMLHttpRequest();
		http.open('POST', url, true);

		//Send the proper header information along with the request
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		http.onreadystatechange = function () {//Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {
				resolve(http.response);
			}
		}
		http.send(JSON.stringify(payload));
	});
}

function httpGetAsync(theUrl, param, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(JSON.parse(xmlHttp.responseText));
	}
	xmlHttp.open("GET", theUrl + '?source=' + param, true); // true for asynchronous 
	xmlHttp.send(null);
}

function menu() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

export {
	sendHttpPostRequest,
	httpGetAsync,
	menu
}
