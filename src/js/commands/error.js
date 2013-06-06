Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="error">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs error message.';
	}	
})