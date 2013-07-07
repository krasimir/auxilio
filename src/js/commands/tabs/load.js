Commands.register("load", {
	requiredArguments: 1,
	format: '<pre></pre>',
	run: function(args, callback) {
		var url = args[0];
		if(url.indexOf("http") == -1) url = "http://" + url;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "load", url: url}, function() {
				exec("echo " + url + " is loaded");
				callback();
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Loads another page in the current tab.',
		format: 'load [url]',
		examples: [
			{text: 'Command line', code: 'load github.com'},
			{text: 'In script', code: 'load("github.com", function() {\n\
	console.log("new page loaded");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})