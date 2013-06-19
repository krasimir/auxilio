Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> ' + this.formatter(args) + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs info message.';
	}	
})