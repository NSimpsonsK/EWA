<?php

class Order
{
	private $orderer;
	private $order;
	private $responsible;
	private $status;
	private $session_id;
	private $price;

	public function __construct($order, $orderer, $price, $session_id)
	{
		$this->order = $order;
		$this->orderer = $orderer;
		$this->price = $price;
		$this->session_id = $session_id;
	}



	public function getOrderer()
	{
		return $this->orderer;
	}
	public function getOrder()
	{
		return $this->order;
	}
	public function setStep($responsible, $status)
	{
		$this->responsible = $responsible;
		$this->status = $status;
	}
	public function setResponsible($responsible) // backer - driver
	{
		$this->responsible = $responsible;
	}
	public function setStatus($status) // (ordered - Oven - finish) - (baked - onTheWay - delivered )
	{
		$this->status = $status;
	}
	public function getSessionId()
	{
		return $this->session_id;
	}
	public function getClientName()
	{
		return $this->orderer['clientName'];
	}
	public function getClientAddress()
	{
		return $this->orderer['clientAddress'];
	}
	public function getResponsible()
	{
		return $this->responsible;
	}
	public function getStatus()
	{
		return $this->status;
	}
	public function getPrice()
	{
		return $this->price;
	}
}