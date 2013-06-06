Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	run: function(args) {
		App.info(args.join(" "));
	},
	man: function() {
		return 'Outputs info message.';
	}	
})