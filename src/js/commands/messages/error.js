Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs error message.';
	}	
})