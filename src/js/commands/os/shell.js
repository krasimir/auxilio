Commands.register("shell", {
	requiredArguments: 0,
	format: '<pre>shell [command]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var command = args.join(" ");
		if(Shell.connected()) {
			if(command !== '') {
				Shell.send(command, function(res) {
					callback(res);
				});
			} else {
				callback();
			}
		} else {
			if(args.length === 0) {
				Shell.connect();
			} else {
				exec("error Sorry, the corresponding nodejs module is not running or you misspell the command.");
			}
			callback();
		}
	},
	man: function() {
		return 'Executes shell command.';
	}	
})