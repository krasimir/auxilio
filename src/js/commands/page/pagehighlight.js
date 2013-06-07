Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre>pagehighlight [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "highlight", selector: selector}, function(res) {
				exec("info pagehighlight: selector <b>" + selector + "</b> (" + res.elements + " element(s) matching)");
				callback(res);
			});
		}
	},
	man: function() {
		return 'Highlights element/elements on the page.';
	}	
})