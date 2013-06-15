<?php

	$result = 'There is no search keyword typed.';
	if(
		isset($_POST["s"]) && 
		$_POST["s"] !== ""
	) {
		$result = 'Search: '.$_POST["s"];
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
            <hr />
            <h3>Back to <a href="index.html">home page</a></h3>
        </div>
    </body>
</html>