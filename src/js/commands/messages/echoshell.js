Commands.register("echoshell", {
	requiredArguments: 1,
	format: '<pre>echoshell [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular-shell">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs message.';
	}	
})