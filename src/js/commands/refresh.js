Commands.register("refresh", {
	requiredArguments: 0,
	format: '<pre>refresh</pre>',
	run: function(args) {
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "refresh"});
	},
	man: function() {
		return 'Refreshes the current tab\'s page';
	}	
})