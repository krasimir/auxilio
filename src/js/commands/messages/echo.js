Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs message.';
	}	
})