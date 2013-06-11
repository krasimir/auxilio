Commands.register("echocommand", {
	requiredArguments: 1,
	format: '<pre>echo [command]</pre>',
	run: function(args, callback) {
		var command = args.join(" ");
		exec(command, function(res) {
			if(typeof res === "string") {
				exec("echo " + res);
			} else {
				exec("echo " + JSON.stringify(res));
			}
			callback();
		});
	},
	man: function() {
		return 'Outputs result of a command.';
	}	
})