Commands.register("newtab", {
	requiredArguments: 0,
	format: '<pre>newtab\nnewtab [url] [active (true | false)]</pre>',
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
		}
	},
	man: function() {
		return 'Creates a new tab.';
	}	
})