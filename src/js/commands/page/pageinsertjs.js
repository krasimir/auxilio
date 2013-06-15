Commands.register("pageinsertjs", {
	requiredArguments: 1,
	format: '<pre>pageinsertjs [js code]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertjs", jscode: jscode}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Executes javascript code in the context of the current page<br />\
		Example:<br />\
		pageinsertjs "document.querySelector(\'body\').click();"';
	}	
})