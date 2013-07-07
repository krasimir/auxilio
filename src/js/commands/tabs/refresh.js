Commands.register("refresh", {
	requiredArguments: 0,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "refresh"}, function() {
				exec("echo current tab is refreshed");
				callback();
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Refreshes the current tab\'s page',
		format: 'refresh',
		examples: [
			{text: 'Command line', code: 'refresh'},
			{text: 'In script', code: 'refresh(function() {\n\
	console.log("The current page is refreshed.");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})