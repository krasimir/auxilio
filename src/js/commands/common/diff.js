Commands.register("diff", {
	requiredArguments: 0,
	format: '<pre>diff\ndiff [string1] [string2]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		if(args.length === 0) {
			var self = this;
			exec("inject raw", function(res) {
				if(!res) {
					callback();
					return;
				}
				if(res.length === 2) {
					var file1Ext = self.getExt(res[0].file.name);
					var file2Ext = self.getExt(res[1].file.name);
					if(file1Ext === file2Ext && file1Ext === "json") {
						var file1JSON, file2JSON;
						try {
							file1JSON = JSON.parse(res[0].content);
						} catch(e) {
							exec("error File " + res[0].file.name + " contains invalid json.");
							callback();
							return;
						}
						try {
							file2JSON = JSON.parse(res[1].content);
						} catch(e) {
							exec("error File " + res[1].file.name + " contains invalid json.");
							callback();
							return;
						}
						console.log(file1JSON, file2JSON);
						self.compareJSON(file1JSON, file2JSON, callback);
					} else {
						self.compareText(res[0].content, res[1].content, callback);
					}
				} else {
					exec("error <i>diff</i> works with two files.");
				}
			});
		} else if(args.length === 2) {
			this.compareText(args.shift(), args.shift(), callback);
		} else if(args.length > 0) {
			exec("error Sorry, but <i>diff</i> requires two or no arguments.")
		}
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
		exec("echo " + result);
		callback(d);
	},
	getExt: function(filename) {
		var parts = filename.split(".");
		return parts[parts.length-1].toLowerCase();
	},
	man: function() {
		return 'Comparison of files or strings.';
	}	
})