Commands.register("diff", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		if(args.length >= 2) {
			var self = this;
			var file1 = args[0];
			var file2 = args[1];
			exec("readfile " + file1, function(resFile1) {
				exec("readfile " + file2, function(resFile2) {
					var file1Ext = self.getExt(file1);
					var file2Ext = self.getExt(file2);
					if(file1Ext === file2Ext && file1Ext === "json") {
						var file1JSON, file2JSON;
						try {
							file1JSON = JSON.parse(resFile1);
						} catch(e) {
							exec("error File " + file1 + " contains invalid json.");
							callback();
							return;
						}
						try {
							file2JSON = JSON.parse(resFile2);
						} catch(e) {
							exec("error File " + file2 + " contains invalid json.");
							callback();
							return;
						}
						self.compareJSON(file1JSON, file2JSON, callback);
					} else {
						self.compareText(resFile1, resFile2, callback);
					}
				})
			});
		} else {
			exec("error Sorry, but <i>diff</i> requires two arguments.")
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
		var diff = dmp.diff_prettyHtml(d);
		result += 'Difference:<pre>' + diff + '</pre>';
		// result += 'Text #1:<pre>' + t1 + '</pre>';
		// result += 'Text #2:<pre>' + t2 + '</pre>';
		exec("echo " + result);
		callback(d);
	},
	getExt: function(filename) {
		var parts = filename.split(".");
		return parts[parts.length-1].toLowerCase();
	},
	man: {
		desc: 'Comparison of files (text and json).',
		format: 'diff [file1] [file2]',
		examples: [
			{text: 'Compare two files', code: 'diff ./file1.txt ./file2.txt'},
			{text: 'In script', code: 'diff(\'"file1.txt"\', \'"file2.txt"\', function(res) {\n\
	console.log(res);\n\
})'}
		],
		returns: 'Object containing the differences.',
		group: 'common'
	}
})