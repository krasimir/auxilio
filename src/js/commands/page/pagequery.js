Commands.register("pagequery", {
	requiredArguments: 1,
	format: '<pre>pagequery [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "query", selector: selector}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Returns the number of matched elements.';
	}	
})