Commands.register("warning", {
	requiredArguments: 1,
	format: '<pre>warning [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="warning">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs warning message.';
	}	
})