Commands.register("exec", {
	requiredArguments: 1,
	format: '<pre>exec [command/s]</pre>',
	run: function(args, callback) {
		exec(args.join(" "), function(res) {
			callback(res);
		});
	},
	man: function() {
		return 'Executes a given command. Accepts commands separated by <i>&&</i>.';
	}	
})