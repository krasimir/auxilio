Commands.register("writefile", {
	requiredArguments: 1,
	format: '<pre>writefile [file] [content]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var file = args.shift();
		var content = args.join(" ");
		if(Shell.connected() && Shell.socket()) {
			var onFileSaved = function(res) {
				Shell.socket().removeListener("writefile", onFileSaved);
				if(res.error) {
					exec("error " + res.error);
				} else if(res.content) {
					exec("success " + res.content);
				}
				callback();
			}
			Shell.socket().on("writefile", onFileSaved);
			Shell.socket().emit("writefile", {file: file, content: content});
		} else {
			NoShellError("writefile: no shell");
			callback();
		}
	},
	man: function() {
		return 'Write content to a file.';
	}	
})