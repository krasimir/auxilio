Commands.register("marker", {
	requiredArguments: 0,
	format: '<pre>marker</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "marker"}, callback);
		}
	},
	man: function() {
		return 'Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.';
	}	
})