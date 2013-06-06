Commands.register("exec", {
	requiredArguments: 1,
	format: '<pre>exec [command]</pre>',
	run: function(args, callback) {
		App.execute(args.join(" "), callback);
	},
	man: function() {
		return 'Executes given command';
	}	
})