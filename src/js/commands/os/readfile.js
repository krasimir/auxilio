Commands.register("readfile", {
	requiredArguments: 1,
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
	man: {
		desc: 'Read content of a file.',
		format: 'readfile [file]',
		examples: [
			{text: 'Command line', code: 'readfile ./README.md'},
			{text: 'In script', code: 'readfile("./README.md", function(content) {\n\
	console.log(content);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})