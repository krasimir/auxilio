Commands.register("shell", {
	requiredArguments: 1,
	format: '<pre>shell [command]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var command = args.join(" ");
		if(Shell.connected()) {
			Shell.send(command, function(res) {
				callback(res);
			});
		} else {
			exec("error Sorry, the corresponding nodejs module is not running or you misspell the command.");
			callback();
		}
	},
	man: function() {
		return 'Executes shell command.';
	}	
})