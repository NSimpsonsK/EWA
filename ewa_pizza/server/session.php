<?php
class Session
{
	function __construct()
	{
		session_start();
	}
	public static function setSessionData($key, $value)
	{
		$_SESSION[$key] = $value;
	}
	public static function getSessionData($key)
	{
		return $_SESSION[$key];
	}
	public static function destroySession()
	{
		session_destroy();
	}
}