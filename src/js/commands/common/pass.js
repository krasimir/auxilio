Commands.register("pass", {
	requiredArguments: 1,
	format: '<pre>pass</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback();
	},
	man: function() {
		return 'If there are some commands in a chain, sometimes is needed to stop passing a result from one to another. This command simply calls its callback without any arguments.';
	}	
})