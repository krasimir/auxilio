Commands.register("alert", {
	requiredArguments: 1,
	format: '<pre>alert [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		alert(args.join(" "));
		callback();
	},
	man: function() {
		return 'Alerts message.';
	}	
})