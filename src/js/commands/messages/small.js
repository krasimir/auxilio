Commands.register("small", {
	requiredArguments: 1,
	format: '<pre>small [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs small message.';
	}	
})