Commands.register("pageclick", {
	requiredArguments: 1,
	format: '<pre>pageclick [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "click", selector: selector}, callback);
	},
	man: function() {
		return 'Clicks element on the page.';
	}	
})