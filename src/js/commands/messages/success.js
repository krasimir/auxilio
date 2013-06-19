Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> ' + this.formatter(args) + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs success message.';
	}	
})