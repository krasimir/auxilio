var CurrentBlockDirectory = null;
Commands.register("block", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var operation = args.shift();
		if(operation === "start") {
			exec("cwd", function(dir) {
				CurrentBlockDirectory = dir;
				callback();
			})
		} else if(operation === "end") {
			if(CurrentBlockDirectory) {
				exec("cd " + CurrentBlockDirectory, function() {
					callback();
				})
			} else {
				exec("error block already ended.");
				callback();
			}
		} else {
			exec("error <b>block</b> accepts only <i>start</i> and <i>end</i> operations. <i>" + operation + "</i> given.");
			callback();
		}
	},
	man: {
		desc: 'Sometimes you need to execute a series of commands, but you want to keep the context, i.e. the current directory.',
		format: 'block [operation]',
		examples: [
			{text: 'Command line', code: 'block start && cd ../../ && echo Do some stuff here && block end'},
			{text: 'In script', code: 'block("start", function() {\n\
	shell("cd ../../", function() {\n\
		block("end");\n\
	});\n\
});'}
		],
		returns: 'null',
		group: 'os'
	}	
})