Commands.register("cwd", {
	requiredArguments: 0,
	format: '<pre>cwd</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		callback(Context.get());
	},
	man: function() {
		return 'Returns the current working directory of auxilio-backend.';
	}	
})