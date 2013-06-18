Commands.register("diff", {
	requiredArguments: 0,
	format: '<pre>diff</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		// this.compareText("Krasimir Tsonev is web developer", "Krasimir tyonev is developer", callback);
		// this.compareJSON({a: 20}, {a: 20, b: { c: 20 }}, callback);
	},
	compareJSON: function(ob1, ob2, callback) {
		var diff = objectDiff.diffOwnProperties(ob1, ob2);		
		var markup = '<pre>' + objectDiff.convertToXMLString(diff) + '</pre>';
		exec("echo " + markup);
		callback(diff);
	},
	compareText: function(t1, t2, callback) {
		var dmp = new diff_match_patch();
		var d = dmp.diff_main(t1, t2);
		// dmp.diff_cleanupSemantic(d);
		// dmp.diff_cleanupEfficiency(d);
		var result = '';
		result += 'Difference:<pre>' + dmp.diff_prettyHtml(d) + '</pre>';
		result += 'Text #1:<pre>' + t1 + '</pre>';
		result += 'Text #2:<pre>' + t2 + '</pre>';
		exec("echo " + result)
		callback(d);
	},
	man: function() {
		return 'Comparison of files.';
	}	
})