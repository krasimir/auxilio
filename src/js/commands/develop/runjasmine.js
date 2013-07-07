Commands.register("runjasmine", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		var id = _.uniqueId("jasminetest");
		(function(id) {
			var markup = '<div id="' + id + '"></div>';
			App.setOutputPanelContent(markup);
			exec("run " + path, function(totalFilesProcessed) {
				var jasmineEnv = jasmine.getEnv();
				var htmlReporter = new jasmine.HtmlReporter(null, document.getElementById(id));
				jasmineEnv.updateInterval = 1000;
				jasmineEnv.clearReporters();
				jasmineEnv.addReporter(htmlReporter);
				jasmineEnv.specFilter = function(spec) {
					return htmlReporter.specFilter(spec);
				};
				jasmineEnv.execute();
			});
		})(id);
		callback();
	},
	man: {
		desc: 'Runs jasmine tests.',
		format: 'runjasmine [path]',
		examples: [
			{text: 'Command line', code: 'runjasmine ./tests'}
		],
		returns: 'null',
		group: 'develop'
	}	
})