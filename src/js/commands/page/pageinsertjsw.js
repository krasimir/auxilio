Commands.register("pageinsertjsw", {
	requiredArguments: 1,
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertjsw", jscode: jscode}, function(res) {
				if(res) {
					res = JSON.parse(res);
					if(res.length === 1) res = res[0];
				}
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Executes javascript code in the context of the current page and waits till the current page is updated',
		format: 'pageinsertjsw [js code]',
		examples: [
			{text: 'Command line', code: 'pageinsertjsw "document.querySelector(\'body\').click();"'},
			{text: 'In script', code: 'pageinsertjsw("document.querySelector(\'body\').click();", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'page'
	}	
})