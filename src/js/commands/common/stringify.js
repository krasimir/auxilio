Commands.register("stringify", {
	requiredArguments: 1,
	format: '<pre>stringify [text or object]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] !== "string" && typeof args[i] !== "number") {
				args[i] = JSON.stringify(args[i]);
			}
		}
		callback(args.join(" "));
	},
	man: function() {
		return 'Just bypasses the given arguments as string';
	}	
})