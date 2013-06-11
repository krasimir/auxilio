Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs info message.';
	}	
})