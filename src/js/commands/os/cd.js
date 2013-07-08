Commands.register("cd", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		shell("cd " + path, callback)
	},
	man: {
		desc: 'Change the current directory',
		format: 'cd [path]',
		examples: [
			{text: 'Command line', code: 'cd D:/Work'},
			{text: 'In script', code: 'cd("D:/Work", function() {\n\
	console.log("directory changed");\n\
});'}
		],
		returns: 'null',
		group: 'os'
	}	
})