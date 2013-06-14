Commands.register("pagequery", {
	requiredArguments: 1,
	format: '<pre>pagequery [selector]</pre>',
	run: function(args, callback) {
		var selector = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagequery", selector: selector}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Returns the number of matched elements and the elements in raw html string format.<br />\
		Example: {"elements": 1, "raw": ["&lt;a href=\"#\">test&lt;/a>"]}';
	}	
})