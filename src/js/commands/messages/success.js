Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="success">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs success message.';
	}	
})