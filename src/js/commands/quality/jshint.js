Commands.register("jshint", {
	requiredArguments: 1,
	format: '<pre>jshint [{filePath: ... file path here..., jshint: ... jshint result here ...}]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var data = args.shift();
		if(data.jshint && typeof data.jshint === 'object') {
			var jshintData = data.jshint;
			if(jshintData.errors && jshintData.errors.length > 0) {
				var str = 'JSHint (<b>' + data.filePath + '</b>): <br />';
				for(var i=0; error = jshintData.errors[i]; i++) {
					str += error.line + ':' + error.character + ' -> ' + error.reason + ' -> ' + error.evidence + '<br />';
				}
				exec("error " + str);
			} else {
				this.noError(data.filePath);
			}
		} else {
			this.noError(data.filePath);
		}
		callback(data);
	},
	noError: function(filePath) {
		exec("success No errors in <b>" + filePath + "</b>.");
	},
	man: function() {
		return 'Formats an output of jshint execution.';
	}	
})