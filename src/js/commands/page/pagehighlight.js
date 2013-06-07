Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre>pagehighlight [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "highlight", selector: selector}, callback);
	},
	man: function() {
		return 'Highlights element/elements on the page.';
	}	
})