Commands.register("refresh", {
	requiredArguments: 0,
	format: '<pre>refresh</pre>',
	run: function(args, callback) {
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "refresh"}, function() {
			exec("info refresh: current tab is refreshed");
			callback();
		});
	},
	man: function() {
		return 'Refreshes the current tab\'s page';
	}	
})