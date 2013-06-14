Commands.register("pagetrigger", {
	requiredArguments: 2,
	format: '<pre>pagetrigger [selector or object] [method name]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var methodName = args.shift();
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagetrigger", selector: selector, methodName: methodName}, function(res) {
				callback(res);
			});
		}
	},
	man: function() {
		return 'Trigger a method of element or an object registered in window.<br />\
		Example:<br />\
		pagetrigger "input[name=\'name\']" focus';
	}	
})