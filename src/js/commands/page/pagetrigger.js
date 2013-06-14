Commands.register("pagetrigger", {
	requiredArguments: 1,
	format: '<pre>pagetrigger [js code]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.shift();
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagetrigger", jscode: jscode}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Executes javascript code in the context of the current page<br />\
		Example:<br />\
		pagetrigger "input[name=\'name\']" focus';
	}	
})