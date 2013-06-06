Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="success">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs success message.';
	}	
})