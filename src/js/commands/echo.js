Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="regular">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs message.';
	}	
})