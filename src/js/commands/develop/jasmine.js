Commands.register("jasmine", {
	requiredArguments: 1,
	format: '<pre>jasmine [path]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		var id = _.uniqueId("jasminetest");
		(function(id) {
			var markup = '<div id="' + id + '"></div>';
			App.setOutputPanelContent(markup);
			exec("import " + path, function(totalFilesProcessed) {
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
	},
	man: function() {
		return 'Runs jasmine tests.';
	}	
})