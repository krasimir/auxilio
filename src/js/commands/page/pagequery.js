Commands.register("pagequery", {
	requiredArguments: 1,
	format: '<pre>pagequery [selector] [filter]</pre>',
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
	man: function() {
		return 'Returns the number of matched elements and the elements in raw html string format.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.\
		Example: {"elements": 1, "raw": ["&lt;a href=\"#\">test&lt;/a>"]}';
	}	
})