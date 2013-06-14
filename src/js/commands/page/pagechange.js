Commands.register("pagechange", {
	requiredArguments: 3,
	format: '<pre>pagechange [selector] [attribute] [value]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var attribute = args.shift();
		var value = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagechange", selector: selector, attribute: attribute, value: value}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Set a new value to element\'s attribute<br />\
		Example:<br />\
		pagechange "input[name=\'name\']" value "firstname lastname"';
	}	
})