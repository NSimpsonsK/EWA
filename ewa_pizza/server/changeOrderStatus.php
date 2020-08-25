<?php
require_once 'Mysql.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	header('Content-Type: application/json');
	$data = json_decode(file_get_contents('php://input'), true);
	$db = new Mysql('10.35.47.118', 'k84888_ewa', 'k84888_root', 'easypassword123', session_id());
	if ($data['responsible'] == 'baker') {
		$db->alterPizzaStatus($data['pizza_id'], $data['responsible'], $data['status']);
	} elseif ($data['responsible'] == 'driver') {
		$db->alterPizzasStatusByOrderId($data['order_id'], $data['status']);
	}

	$json = array(
		'status' => 'OK'
	);
	$json['pizza'] = $result = $db->selectAllFrom('pizza', 'name', 'pizza_id', 'quantity', 'client_id', 'baker_status', 'driver_status');
	$db->closeConnection();
	echo json_encode($json);


}