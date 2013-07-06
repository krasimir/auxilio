Commands.register("stringify", {
	requiredArguments: 1,
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
	man: {
		desc: 'Just bypasses the given arguments as string',
		format: 'stringify [text or object]',
		examples: [
			{text: 'Command line', code: 'date true && stringify && info'}
		],
		returns: 'string',
		group: 'common'
	}	
})