Commands.register("pageexpect", {
	requiredArguments: 1,
	format: '<pre>pageexpect [selector] [filter]</pre>',
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
	man: function() {
		return 'Checks if there is an element matching the provided selector.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element';
	}	
})