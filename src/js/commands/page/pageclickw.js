Commands.register("pageclickw", {
	requiredArguments: 1,
	format: '<pre>pageclickw [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclickw", selector: selector}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Clicks an element on the page and waits till the page is updated (i.e. a new url is fully loaded).';
	}	
})