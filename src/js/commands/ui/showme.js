Commands.register("showme", {
	requiredArguments: 1,
	format: '<pre>showme [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "showme", selector: selector}, callback);
	},
	man: function() {
		return 'Shows element/elements on the page.';
	}	
})