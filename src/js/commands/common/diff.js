Commands.register("diff", {
	requiredArguments: 0,
	format: '<pre>diff</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		this.compareJSON({a: 20}, {a: 20, b: { c: 20 }}, callback);
	},
	compareJSON: function(ob1, ob2, callback) {
		var diff = objectDiff.diffOwnProperties(ob1, ob2);		
		var markup = '<pre>' + objectDiff.convertToXMLString(diff) + '</pre>';
		exec("echo " + markup);
		callback();
	},
	man: function() {
		return 'Comparison of files.';
	}	
})