<?php
session_start();
header("content-type: text/plain");
echo "SERVER => \r\n";
print_r($_SERVER);
echo "SESSION => \r\n";
print_r($_SESSION);
echo "\n\nLIP:\n";
echo getHostByName(php_uname('n'));
?>