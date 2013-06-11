Commands.register("warning", {
	requiredArguments: 1,
	format: '<pre>warning [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs warning message.';
	}	
})