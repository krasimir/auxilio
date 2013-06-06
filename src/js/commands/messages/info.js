Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="info">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs info message.';
	}	
})