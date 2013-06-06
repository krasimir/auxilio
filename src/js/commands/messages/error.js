Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="error">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs error message.';
	}	
})