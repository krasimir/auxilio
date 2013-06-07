Commands.register("pageclicknavigate", {
	requiredArguments: 1,
	format: '<pre>pageclicknavigate [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "clicknavigate", selector: selector}, function(res) {
				exec("info pageclicknavigate: selector <b>" + selector + "</b> (" + res.elements + " element(s) matching)");
				callback(res);
			});
		}
	},
	man: function() {
		return 'Clicks an element on the page and waits till the page is updated (i.e. a new url is fully loaded).';
	}	
})