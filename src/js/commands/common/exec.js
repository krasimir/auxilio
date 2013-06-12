Commands.register("exec", {
	requiredArguments: 1,
	format: '<pre>error [command/s]</pre>',
	run: function(args, callback) {
		exec(args.join(" "), function(res) {
			callback(res);
		});
	},
	man: function() {
		return 'Executes a given command.';
	}	
})