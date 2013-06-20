Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs message.';
	}	
})