Commands.register("readfile", {
	requiredArguments: 1,
	format: '<pre>readfile [file]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var file = args.shift();
		if(Shell.connected() && Shell.socket()) {
			var id = _.uniqueId("shellcommand");
			var onFileRead = function(res) {
				if(res.id !== id) return;
				Shell.socket().removeListener("readfile", onFileRead);
				if(res.error) {
					if(typeof res.error === 'object') {
						res.error = JSON.stringify(res.error);
					}
					exec("error " + res.error);
					callback(null);
				} else if(res.content) {
					callback(res.content);
				} else {
					callback(res);
				}
			}
			Shell.socket().on("readfile", onFileRead);
			Shell.socket().emit("readfile", {file: file, id: id});
		} else {
			NoShellError("readfile: no shell");
			callback();
		}
	},
	man: function() {
		return 'Read content of a file.';
	}	
})