Commands.register("pageinsertjsw", {
	requiredArguments: 1,
	format: '<pre>pageinsertjsw [js code]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertjsw", jscode: jscode}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Executes javascript code in the context of the current page and waits till the current page is updated<br />\
		Example:<br />\
		pageinsertjsw "document.querySelector(\'form\').submit();"';
	}	
})