Commands.register("pageclickw", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclickw", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Clicks an element on the page and waits till the page is updated. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pageclickw [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageclickw "body > .my-link-class"'},
			{text: 'Filter the selected elements', code: 'pageclickw "body > .my-link-class" "link label"'},
			{text: 'In script', code: 'pageclickw("body > .my-link-class", function() {\n\
	console.log("Element clicked.");\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})