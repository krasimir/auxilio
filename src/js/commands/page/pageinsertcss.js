Commands.register("pageinsertcss", {
	requiredArguments: 1,
	format: '<pre></pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var csscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertcss", csscode: csscode}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Inserts css code in the context of the current page',
		format: 'pageinsertcss [css code]',
		examples: [
			{text: 'Command line', code: 'pageinsertcss body { background: #F00 !important; }'},
			{text: 'In script', code: 'pageinsertcss("body { background: #F00 !important; }", function() {\n\
	console.log("CSS applied.");\n\
});'}
		],
		returns: 'string',
		group: 'page'
	}	
})