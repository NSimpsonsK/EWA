<?php
require_once 'Mysql.php';
require_once 'order.php';
//session start
session_start();
$orderer = array();
$order = array();
//fetch data
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	try {
		header('Content-Type: application/json');
		$data = json_decode(file_get_contents('php://input'), true);
	//assign data to local variable
		foreach ($data as $key => $value) {
			if ($key == 'orders') {
				$order = $value;
			} elseif ($key == 'orderer') {
				$orderer = $value;
			} elseif ($key == 'price') {
				$price = $value;
			}
		}

		$Order = new Order($order, $orderer, $price, session_id());
		$Order->setStep('baker', 'ordered');

		$db = new Mysql('10.35.47.118', 'k84888_ewa', 'k84888_root', 'easypassword123', session_id());

		$client_id = $db->insertIntoClient($Order->getClientName(), $Order->getClientAddress())['client_id'];
		$pizza_names = array();

		foreach ($Order->getOrder() as $key => $pizza) {
			array_push($pizza_names, $pizza['name']);
			$db->insertIntoPizza($pizza['name'], $pizza['quantity'], $Order->getResponsible() == 'baker' ? $Order->getStatus() : 'undefined', $Order->getResponsible() == 'driver' ? $Order->getStatus() : 'undefined', $client_id);
		}

		$order_id = $db->insertIntoOrder(session_id(), $client_id, $Order->getPrice())['order_id'];
		

		// print order 
		$json = array(
			'status' => 'OK',
			'pizzas' => []
		);
		foreach ($pizza_names as $name) {
			array_push($json['pizzas'], $name);
		}
		$db->closeConnection();
		echo json_encode($json);
	} catch (Exception $e) {
		die('Error occurred!');
	}
}
