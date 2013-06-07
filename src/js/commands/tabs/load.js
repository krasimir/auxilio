Commands.register("load", {
	requiredArguments: 1,
	format: '<pre>load [url]</pre>',
	run: function(args, callback) {
		var url = args[0];
		if(url.indexOf("http") == -1) url = "http://" + url;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "load", url: url}, function() {
				exec("info load: " + url + " is loaded");
				callback();
			});
		}
	},
	man: function() {
		return 'Loads another page in the current tab.';
	}	
})