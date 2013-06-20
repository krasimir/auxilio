Commands.register("title", {
	requiredArguments: 1,
	format: '<pre>title [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><h1>' + this.formatter(args) + '</h1></div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs a title.';
	}	
})