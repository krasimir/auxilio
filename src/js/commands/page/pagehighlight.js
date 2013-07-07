Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre></pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagehighlight", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Highlights element/elements on the page. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pagehighlight [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pagehighlight a'},
			{text: 'In script', code: 'pagehighlight("a", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})