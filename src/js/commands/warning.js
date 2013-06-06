Commands.register("warning", {
	requiredArguments: 1,
	format: '<pre>warning [text]</pre>',
	run: function(args) {
		App.warning(args.join(" "));
	},
	man: function() {
		return 'Outputs warning message.';
	}	
})