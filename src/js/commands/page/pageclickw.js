Commands.register("pageclickw", {
	requiredArguments: 1,
	format: '<pre>pageclickw [selector] [filter]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclickw", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Clicks an element on the page and waits till the page is updated (i.e. a new url is fully loaded).<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.';
	}	
})