Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	run: function(args) {
		App.success(args.join(" "));
	},
	man: function() {
		return 'Outputs success message.';
	}	
})