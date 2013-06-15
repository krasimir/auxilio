Commands.register("hr", {
	requiredArguments: 0,
	format: '<pre>hr</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><hr /></div>');
		callback();
	},
	man: function() {
		return 'Adds &lt;hr /> tag to the console\'s output panel';
	}	
})