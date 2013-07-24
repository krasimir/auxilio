function nameOfCommand(args, callback) {
	var commitMessage = args.length > 0 ? args.join(" ") : false;
	if(commitMessage === false) {
		error("Sorry, please type a commit message.");
		callback();
	} else {
		echo("Pushing to production with message = '" + commitMessage + "'");
		callback();
	}    
}