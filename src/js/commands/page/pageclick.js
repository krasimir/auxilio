Commands.register("pageclick", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclick", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Clicks an element on the page and returns the result immediately. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pageclick [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageclick "body > .my-link-class"'},
			{text: 'Filter the selected elements', code: 'pageclick "body > .my-link-class" "link label"'},
			{text: 'In script', code: 'pageclick("body > .my-link-class", function(res) {\n\
	console.log("Element clicked.");\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}
})