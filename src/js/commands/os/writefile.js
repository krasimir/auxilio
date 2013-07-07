Commands.register("writefile", {
	requiredArguments: 1,
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
					exec("success <small>" + res.content + "</small>");
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
	man: {
		desc: 'Write content to a file.',
		format: 'writefile [file] [content]',
		examples: [
			{text: 'Command line', code: 'writefile ./test.txt Sample text here.'},
			{text: 'In script', code: 'writefile("./test.txt", "Sample text here", function(res) {\n\
	console.log("File saved successfully.");\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})