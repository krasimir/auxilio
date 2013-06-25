Commands.register("middleman", {
	requiredArguments: 1,
	format: '<pre>middleman [resource]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback(args);
	},
	man: function() {
		return 'The command simply passes the given argument to its callback';
	}	
})