Commands.register("newtab", {
	requiredArguments: 0,
	format: '<pre>newtab\nnewtab [url]</pre>',
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			if(args[0]) {
				var url = args[0];
				if(url.indexOf("http") == -1 && url.indexOf("data:image") == -1) {
					url = "http://" + url;
				}
				chrome.runtime.sendMessage({type: "newtab", url: url}, function() {
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