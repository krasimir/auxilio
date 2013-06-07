Commands.register("small", {
	requiredArguments: 1,
	format: '<pre>small [text]</pre>',
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs small message.';
	}	
})