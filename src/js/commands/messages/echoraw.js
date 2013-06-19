Commands.register("echoraw", {
	requiredArguments: 1,
	format: '<pre>echoraw [string]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args, true, true, true) + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs message in raw format. Even the html is shown as string.';
	}	
})