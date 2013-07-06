Commands.register("middleman", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback(args);
	},
	man: {
		desc: 'The command simply passes the given argument to its callback',
		format: 'middleman [resource]',
		examples: [
			{text: 'Command line (chaining)', code: 'date && middleman && echo'}
		],
		returns: 'The result of the previous command in the chain.',
		group: 'common'
	}	
})