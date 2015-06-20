<?php

require_once 'password_compatibility_library.php';
require 'vendor/autoload.php';
date_default_timezone_set('Europe/Paris');


class CustomMiddleware extends Slim\Middleware
{
    public function call() {
        // This session variable should be saved
        $_SESSION['auth_token'] = 'auth';
        $_SESSION['user_id'] = null;

        $this->next->call();
    }
}

$app = new \Slim\Slim();

$app->add(new CustomMiddleware());

$app->add(new Slim\Middleware\SessionCookie());

$app->post('/auth/signup', 'signup');
$app->post('/auth/login', 'login');
$app->get('/auth', 'authentication');
/**
 * Get authentication from sessionModel front end with cookie info
 */
function authentication(){
    $app = \Slim\Slim::getInstance();
    $request = $app->request();
    $cookies = $request->cookies;
    //$body =  json_decode($request->getBody());
    $CookieInfo = session_get_cookie_params();
    echo json_encode($cookies);
    echo json_encode($CookieInfo);
    echo($_SESSION['auth_token']);
    /*
    db.get("SELECT * FROM users WHERE id = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, user){
        if(user){
            res.json({ user: _.omit(user, ['password', 'auth_token']) });
        } else {
            res.json({ error: "Client has no valid login cookies."  });
        }
    });
    */

}
function login(){
    $app = \Slim\Slim::getInstance();
    $request = $app->request();
    $user =  json_decode($request->getBody());
    //$user_password_hash = password_hash($user->password, PASSWORD_DEFAULT);

    $sql = "SELECT *
                        FROM users
                        WHERE user_name = :user_name";
    try {
        $db = getConnection();

        $stmt = $db->prepare($sql);
        $stmt->bindParam("user_name", $user->username);
        //$stmt->bindParam("user_email", $user->email);
        //$stmt->bindParam("auth_token", $newUser->auth_token);
        $stmt->execute();
        $result_row = $stmt->fetchObject();

        if (password_verify($user->password, $result_row->user_password_hash)) {
            $result_row->user_password_hash = null;
            //add cookie
            echo json_encode($result_row);
        }
        //$newUser->id = $db->lastInsertId();
        $db = null;
        //echo json_encode($newUser);


    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/**
 *
 */
function signup(){

    $app = \Slim\Slim::getInstance();
    $request = $app->request();
    $newUser =  json_decode($request->getBody());

    $sql = "INSERT INTO users(user_name, user_password_hash,user_email)
              VALUES (:user_name,:user_password_hash,:user_email)";
    //creates user password hash to keep in database as hash and not as password
    $user_password_hash = password_hash($newUser->password, PASSWORD_DEFAULT);

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user_name", $newUser->username);
        $stmt->bindParam("user_password_hash",$user_password_hash );
        $stmt->bindParam("user_email", $newUser->email);
        //$stmt->bindParam("auth_token", $newUser->auth_token);
        $stmt->execute();
        $newUser->id = $db->lastInsertId();
        $db = null;
        echo json_encode($newUser);

    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}


function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="";
    $dbname="dressin";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app->run();

?>