Commands.register("screenshot", {
	requiredArguments: 0,
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
	man: {
		desc: 'Makes a screenshot of the current tab and loads it in a new tab.',
		format: 'screenshot',
		examples: [
			{text: 'Command line', code: 'screenshot'},
			{text: 'In script', code: 'screenshot(function() {\n\
	console.log("The screenshot is made.");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})