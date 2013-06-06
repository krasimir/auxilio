Commands.register("exec", {
	requiredArguments: 1,
	format: '<pre>exec [command]</pre>',
	run: function(args) {
		App.execute(args.join(" "));
	},
	man: function() {
		return 'Executes given command';
	}	
})