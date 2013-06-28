Commands.register("readfile", {
	requiredArguments: 1,
	format: '<pre>readfile [file]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var file = args.shift();
		if(Shell.connected() && Shell.socket()) {
			var onFileRead = function(res) {
				Shell.socket().removeListener("readfile", onFileRead);
				if(res.error) {
					exec("error " + res.error);
				} else if(res.content) {
					callback(res.content);
				} else {
					callback(res);
				}
			}
			Shell.socket().on("readfile", onFileRead);
			Shell.socket().emit("readfile", {file: file});
		} else {
			NoShellError();
			callback();
		}
	},
	man: function() {
		return 'Read content of a file.';
	}	
})