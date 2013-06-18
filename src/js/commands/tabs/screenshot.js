Commands.register("screenshot", {
	requiredArguments: 0,
	format: '<pre>screenshot</pre>',
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "screenshot"}, function(data) {
				if(data) {
					exec("newtab " + data + " false", function() {
						callback();
					});
				} else {
					exec("error There was a problem creating the screenshot.", callback);
				}
			});
		} else {
			callback();
		}
	},
	man: function() {
		return 'Makes a screenshot of the current tab and loads it in a new tab.';
	}	
})