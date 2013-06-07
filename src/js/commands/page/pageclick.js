Commands.register("pageclick", {
	requiredArguments: 1,
	format: '<pre>pageclick [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "click", selector: selector}, function(res) {
				exec("info pageclick: selector <b>" + selector + "</b> (" + res.elements + " element(s) matching)");
				callback(res);
			});
		}
	},
	man: function() {
		return 'Clicks an element on the page and returns the result immediately.';
	}	
})