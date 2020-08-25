<?php
class Mysql
{
	private $hostname;
	private $database;
	private $username;
	private $password;
	private $link;
	private $session_id;

	public function __construct($hostname, $database, $username, $password, $session_id)
	{
		$this->hostname = $hostname;
		$this->database = $database;
		$this->username = $username;
		$this->password = $password;
		$this->session_id = $session_id;

		$this->link = mysqli_connect($this->hostname, $this->username, $this->password, $this->database);
		if (mysqli_connect_errno($this->link))
			die('no connection could be established!');

		$sql_create_client = 'CREATE TABLE IF NOT EXISTS client(
			client_id INT AUTO_INCREMENT,
			name VARCHAR(50) NOT NULL,
			address VARCHAR(100) NOT NULL,
			PRIMARY KEY (client_id) 
		)';

		$sql_create_pizza = 'CREATE TABLE IF NOT EXISTS pizza(
			pizza_id INT AUTO_INCREMENT,
			name VARCHAR(50) NOT NULL,
			quantity INT NOT NULL,
			baker_status VARCHAR(50) NOT NULL,
			driver_status VARCHAR(50) NOT NULL,
			client_id INT NOT NULL,
			PRIMARY KEY (pizza_id),
			FOREIGN KEY (client_id) REFERENCES client(client_id)
		)';

		$sql_create_order = 'CREATE TABLE IF NOT EXISTS orders(
			order_id INT AUTO_INCREMENT,
			session_id VARCHAR(200) NOT NULL,
			client_id INT NOT NULL,
			price VARCHAR(10) NOT NULL,
			PRIMARY KEY (order_id),
			FOREIGN KEY (client_id) REFERENCES client(client_id)
		)';

		$result_create_client = mysqli_query($this->link, $sql_create_client);
		$result_create_pizza = mysqli_query($this->link, $sql_create_pizza);
		$result_create_order = mysqli_query($this->link, $sql_create_order);
		if (mysqli_errno($this->link)) {
			die('could not create a table');
		}

	}

	public function closeConnection()
	{
		mysqli_close($this->link);
	}

	public function selectAllFrom()
	{
		for ($i = 1, $query = ''; $i < func_num_args(); $i++) {
			$query .= func_get_arg($i) . ($i == func_num_args() - 1 ? '' : ', ');
		}
		$sql = 'SELECT ' . $query . ' FROM ' . func_get_arg(0);
		$result = mysqli_query($this->link, $sql);
		$row = mysqli_fetch_all($result, MYSQLI_ASSOC);
		return $row;
	}
	public function insertIntoPizza($pizza_name, $pizza_quatity, $baker_status, $driver_status, $client_id)
	{
		$stmt = $this->link->prepare('INSERT INTO pizza (name, quantity, baker_status, driver_status, client_id) VALUES (?, ?, ?, ?, ?)');
		$stmt->bind_param('sissi', $pizza_name, $pizza_quatity, $baker_status, $driver_status, $client_id);
		$stmt->execute();

		$searchStmt = $this->link->prepare('SELECT * FROM pizza WHERE name = ? and quantity = ? and baker_status = ? and driver_status = ? and client_id = ?');
		$searchStmt->bind_param('sissi', $pizza_name, $pizza_quatity, $baker_status, $driver_status, $client_id);
		$searchStmt->execute();
		$result = $searchStmt->get_result();
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	public function insertIntoClient($clientName, $clientAddress)
	{
		$stmt = $this->link->prepare('INSERT INTO client(name, address) VALUES (?,?)');
		$stmt->bind_param('ss', $clientName, $clientAddress);
		$stmt->execute();

		$searchStmt = $this->link->prepare('SELECT * FROM client WHERE name = ? and address = ?');
		$searchStmt->bind_param('ss', $clientName, $clientAddress);
		$searchStmt->execute();
		$result = $searchStmt->get_result();
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	public function insertIntoOrder($session_id, $client_id, $price)
	{
		$stmt = $this->link->prepare('INSERT INTO orders (session_id, client_id, price) VALUES (?, ?, ?)');
		$stmt->bind_param('sis', $session_id, $client_id, $price);
		$stmt->execute();

		$searchStmt = $this->link->prepare('SELECT * FROM orders WHERE session_id = ? and client_id = ? and price = ?');
		$searchStmt->bind_param('sis', $session_id, $client_id, $price);
		$searchStmt->execute();
		$result = $searchStmt->get_result();
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	public function alterPizzaStatus($pizza_id, $responsible, $status)
	{
		if ($responsible == 'baker') {
			if ($status == 'finish') {
				$stmt = $this->link->prepare('UPDATE pizza SET ' . $responsible . '_status = ?, driver_status = "baked" WHERE pizza_id = ?');
			} else {
				$stmt = $this->link->prepare('UPDATE pizza SET ' . $responsible . '_status = ? WHERE pizza_id = ?');
			}
			$stmt->bind_param('si', $status, $pizza_id);
			$stmt->execute();
		}

	}
	public function getClientIdsFromPizzaTable()
	{
		$client_ids = array();
		$stmt = $this->link->prepare('SELECT DISTINCT client_id FROM ewa.pizza');
		$stmt->execute();
		$result = $stmt->get_result();
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			array_push($client_ids, $row['client_id']);
		}
		return $client_ids;
	}
	public function checkIfPizzasFinished($client_id)
	{
		$stmt = $this->link->prepare('SELECT * FROM pizza WHERE client_id = ? and (driver_status = "baked" OR driver_status = "onTheWay")');
		$stmt->bind_param('i', $client_id);
		$stmt->execute();
		$resultPredefined = $stmt->get_result();
		$resultPredefinedArray = mysqli_fetch_all($resultPredefined, MYSQLI_ASSOC);

		$stmtCheck = $this->link->prepare('SELECT * FROM pizza WHERE client_id = ?');
		$stmtCheck->bind_param('i', $client_id);
		$stmtCheck->execute();
		$result = $stmtCheck->get_result();
		$resultArray = mysqli_fetch_all($result, MYSQLI_ASSOC);

		if ($resultPredefinedArray == $resultArray) {
			return $resultArray;
		} else {
			return null;
		}
	}
	public function getClientById($client_id)
	{
		$stmt = $this->link->prepare('SELECT name, address FROM client WHERE client_id = ?');
		$stmt->bind_param('i', $client_id);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	public function getOrderByClientId($client_id)
	{
		$stmt = $this->link->prepare('SELECT * FROM orders WHERE client_id = ?');
		$stmt->bind_param('i', $client_id);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	public function alterPizzasStatusByOrderId($order_id, $status)
	{
		// get client id
		$stmt = $this->link->prepare('SELECT * FROM orders where order_id = ?');
		$stmt->bind_param('i', $order_id);
		$stmt->execute();
		$result = $stmt->get_result();
		$client_id = mysqli_fetch_assoc($result)['client_id'];
		// alter all pizzas with this client id		
		$stmtChange = $this->link->prepare('UPDATE pizza SET driver_status = ? WHERE client_id = ?');
		$stmtChange->bind_param('si', $status, $client_id);
		$stmtChange->execute();
	}
	public function getClientPizzasBySessionId($session_id)
	{
		$stmt = $this->link->prepare('SELECT * from orders where session_id = ?');
		$stmt->bind_param('s', $session_id);
		$stmt->execute();
		$result = $stmt->get_result();
		$client_id = mysqli_fetch_assoc($result)['client_id'];
		//get all pizzas with this client_id
		$stmtSearch = $this->link->prepare('SELECT * FROM pizza where client_id = ?');
		$stmtSearch->bind_param('i', $client_id);
		$stmtSearch->execute();
		$returnedResult = $stmtSearch->get_result();
		$row = mysqli_fetch_all($returnedResult, MYSQLI_ASSOC);
		return $row;
	}
}
