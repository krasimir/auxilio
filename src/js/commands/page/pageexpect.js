Commands.register("pageexpect", {
	requiredArguments: 1,
	format: '<pre>pageexpect [selector]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		exec("pagequery " + selector, function(res) {
			if(res.elements && res.elements > 0) {
				if(res.elements === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector.');
				} else {
					exec('success There are ' + res.elements + ' elements matching <b>"' + selector + '"</b> selector.');
				}
				callback(true);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector.')
				callback(false);
			}			
		});
	},
	man: function() {
		return 'Checks if there is an element matching the provided selector.';
	}	
})