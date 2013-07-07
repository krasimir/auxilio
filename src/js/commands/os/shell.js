Commands.register("shell", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var command = args.join(" ");
		if(Shell.connected()) {
			if(command !== '') {
				Shell.send(command, function(res) {
					callback(res);
				});
			} else {
				callback();
			}
		} else {
			if(args.length === 0) {
				Shell.connect();
			} else {
				NoShellError("shell: shell is not connected");
			}
			callback();
		}
	},
	man: {
		desc: 'Executes shell command. Have in mind that once you type something in the console and it doesn\'t match any of the auxilio\'s commands it is send to the shell',
		format: 'shell [command]',
		examples: [
			{text: 'Command line', code: 'shell ls'},
			{text: 'In script', code: 'shell("ls", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})