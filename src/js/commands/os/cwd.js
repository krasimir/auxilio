Commands.register("cwd", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		callback(Context.get());
	},
	man: {
		desc: 'Returns the current working directory of auxilio-backend.',
		format: 'cwd',
		examples: [
			{text: 'Command line', code: 'cwd'},
			{text: 'In script', code: 'cwd(function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})