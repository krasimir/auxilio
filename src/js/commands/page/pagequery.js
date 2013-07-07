Commands.register("pagequery", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;		
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagequery", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Returns the number of matched elements and the elements in raw html string format. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pagequery [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pagequery a "label of the link"'},
			{text: 'In script (checks if there is links on the page)', code: 'pagequery("a", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})