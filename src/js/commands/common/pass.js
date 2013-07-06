Commands.register("pass", {
	requiredArguments: 1,
	format: '<pre></pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback();
	},
	man: {
		desc: 'Sometimes is needed to stop passing a result from one command to another. This command simply calls its callback without any arguments.',
		format: 'pass',
		examples: [
			{text: 'Command line (chaining)', code: 'date true && pass && echo That\'s a string without date.'}
		],
		returns: 'null',
		group: 'common'
	}	
})