Commands.register("pageexpect", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		var command = filter ? "pagequery \"" + selector + "\" " + filter : "pagequery \"" + selector + "\"";
		exec(command, function(res) {
			if(res.elements && res.elements > 0) {
				if(res.elements === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''));
				} else {
					exec('success There are ' + res.elements + ' elements matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''));
				}
				callback(res);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''))
				callback(res);
			}			
		});
	},
	man: {
		desc: 'Checks if there is an element matching the provided selector. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element',
		format: 'pageexpect [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageexpect a.my-link-class label'},
			{text: 'In script', code: 'pageexpect("a.my-link-class", "label, function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})