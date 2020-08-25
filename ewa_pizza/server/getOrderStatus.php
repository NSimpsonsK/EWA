<?php
require_once 'Mysql.php';

session_start();
//db connection
header('Content-Type: application/json');

$db = new Mysql('10.35.47.118', 'k84888_ewa', 'k84888_root', 'easypassword123', session_id());
//check url params for baker
if (isset($_GET["source"]) && trim($_GET["source"]) == 'baker') {
	$result = $db->selectAllFrom('pizza', 'name', 'pizza_id', 'quantity', 'client_id', 'baker_status', 'driver_status');
	$db->closeConnection();
	echo json_encode($result);
}

if (isset($_GET["source"]) && trim($_GET["source"]) == 'driver') {
	$json = array();
	foreach ($db->getClientIdsFromPizzaTable() as $client_id) {
		if (!is_null($db->checkIfPizzasFinished($client_id))) {
			$tmpArr = array();
			$tmpArr['pizzas'] = $db->checkIfPizzasFinished($client_id);
			$tmpArr['client'] = $db->getClientById($client_id);
			$tmpArr['price'] = $db->getOrderByClientId($client_id)['price'];
			$tmpArr['order_id'] = $db->getOrderByClientId($client_id)['order_id'];
			array_push($json, $tmpArr);
		}
	}

	$db->closeConnection();
	echo json_encode($json);
}

if (isset($_GET["source"]) && trim($_GET["source"]) == 'client') {
	$result = $db->getClientPizzasBySessionId(session_id());
	$db->closeConnection();
	echo json_encode($result);
}