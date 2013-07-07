Commands.register("newtab", {
	requiredArguments: 0,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			if(args[0]) {
				var url = args.shift();
				var active = args.length > 0 ? args.shift() : "true";
				if(url.indexOf("http") == -1 && url.indexOf("data:image") == -1) {
					url = "http://" + url;
				}
				chrome.runtime.sendMessage({type: "newtab", url: url, active: active}, function() {
					callback();
				});
			}else {
				chrome.runtime.sendMessage({type: "newtab"}, callback);
			}
		} else {
			callback();
		}
	},
	man: {
		desc: 'Creates a new tab.',
		format: 'newtab<br />newtab [url] [active (true | false)]',
		examples: [
			{text: 'Command line', code: 'newtab github.com'},
			{text: 'In script', code: 'newtab("github.com", "false", function() {\n\
	console.log("new tab loaded");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})