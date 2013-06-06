Commands.register("click", {
	requiredArguments: 1,
	format: '<pre>click [selector]</pre>',
	run: function(args) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "click", selector: selector});
	},
	man: function() {
		return 'Clicks element on the page.';
	}	
})