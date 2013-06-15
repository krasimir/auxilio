Commands.register("pageinsertcss", {
	requiredArguments: 1,
	format: '<pre>pageinsertcss [css code]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var csscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertcss", csscode: csscode}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Inserts css code in the context of the current page<br />\
		Example:<br />\
		pageinsertcss body { background: #F00; }';
	}	
})