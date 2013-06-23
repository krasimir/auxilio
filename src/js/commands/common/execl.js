Commands.register("execl", {
	requiredArguments: 1,
	format: '<pre>execl</pre>',
	run: function(args, callback) {
		args = args.join(" ").replace(/\n/g, ' && ');
		exec(args, function(res) {
			callback(res);
		});
	},
	man: function() {
		return 'Executes a given command/s. Accepts a command separated by new line.';
	}	
})