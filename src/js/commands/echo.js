Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	run: function(args) {
		App.echo(args.join(" "));
	},
	man: function() {
		return 'Outputs message.';
	}	
})