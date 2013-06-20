Commands.register("alert", {
	requiredArguments: 1,
	format: '<pre>alert [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {	
		alert(this.formatter(args, false, true));
		callback(this.formatter(args, false, true));
	},
	man: function() {
		return 'Alerts message.';
	}	
})