Commands.register("pagequery", {
	requiredArguments: 1,
	format: '<pre>pagequery [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "query", selector: selector}, function(res) {
				exec("info pagequery: selector <b>" + selector + "</b> (" + res.elements + " element(s) matching)");
				callback(res);
			});
		}
	},
	man: function() {
		return 'Returns the number of matched elements.';
	}	
})