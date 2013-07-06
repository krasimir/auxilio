Commands.register("exec", {
	requiredArguments: 1,
	run: function(args, callback) {
		var strToExecute = args.join(" ");
		if(strToExecute.indexOf('\n') >= 0) {
			strToExecute = strToExecute.join(" ").replace(/\n/g, ' && ');
		}
		exec(args.join(" "), function(res) {
			callback(res);
		});
	},
	man: {
		desc: 'Executes a given command. Accepts commands separated by <i>&&</i>.',
		format: 'exec [command/s]',
		examples: [
			{text: 'Command line', code: 'exec echo "test"'},
			{text: 'Command line (chaining)', code: 'readfile showing-date.aux && exec'},
			{text: 'In script', code: 'exec("echo Hello world! && date true", function(res) {\n\
	console.log(res);\n\
})'}
		],
		returns: 'The result of the executed command.',
		group: 'common'
	}
})