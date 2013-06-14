<?php

	$result = 'Wrong credentials!';
	if(
		isset($_POST["username"]) && 
		isset($_POST["password"]) && 
		$_POST["username"] === "user" && 
		$_POST["password"] === "pass" 
	) {
		$result = 'Welcome';
	}

?>
<!doctype html>
<html>
    <head>
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="styles.css">        
    </head>
    <body>
        <div class="content">
        	<h1>Login</h1>
            <h3><?php echo $result; ?></h3>
        </div>
    </body>
</html>