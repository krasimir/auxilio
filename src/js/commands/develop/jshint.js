Commands.register("jshint", {
	requiredArguments: 1,
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
		if(filePath && filePath.split('.').pop().toLowerCase() === '.js') {
			exec("success JSHint: No errors in <b>" + filePath + "</b>.");
		}
	},
	man: {
		desc: 'Formats an output of jshint execution. The command is meant to be used together with <i>watch</i>.',
		format: 'jshint [{filePath: [path], jshint: [jshint]}]',
		examples: [
			{text: 'Watching a javascript file for changes and passing the result to jshint.', code: 'watch start ./code.js jshint'}
		],
		returns: 'null',
		group: 'develop'
	}	
})