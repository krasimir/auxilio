Commands.register("warning", {
	requiredArguments: 1,
	format: '<pre>warning [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs warning message.';
	}	
})