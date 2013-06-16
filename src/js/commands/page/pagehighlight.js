Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre>pagehighlight [selector] [filter]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagehighlight", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Highlights element/elements on the page.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.';
	}	
})