var CurrentBlockDirectory = null;
Commands.register("block", {
	requiredArguments: 0,
	format: '<pre>block [operation]</pre>',
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
	man: function() {
		return 'Sometimes you need to execute a series of commands, but you want to keep the context.<br />\
		Use <i>block start</i> before the commands\' chain and <i>block end</i> at the end.';
	}	
})