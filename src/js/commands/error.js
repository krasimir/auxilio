Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	run: function(args) {
		App.error(args.join(" "));
	},
	man: function() {
		return 'Outputs error message.';
	}	
})