<?php
require 'vendor/autoload.php';
date_default_timezone_set('America/New_York');

//$log = new Monolog\Logger('name');
//$log->pushHandler(new Monolog\Handler\StreamHandler('app.txt', Monolog\Logger::WARNING));
//$log->addWarning('Oh Noes.');

$app = new \Slim\Slim( array(
  'view' => new \Slim\Views\Twig()
));



$app->run();