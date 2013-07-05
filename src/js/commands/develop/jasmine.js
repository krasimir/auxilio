Commands.register("jasmine", {
	requiredArguments: 1,
	format: '<pre>jasmine [path]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		var id = _.uniqueId("jasminetest");
		var markup = '<div id="' + id + '"></div>';
		App.setOutputPanelContent(markup);
		exec("import " + path, function() {
			setTimeout(function() {
				var jasmineEnv = jasmine.getEnv();
				var htmlReporter = new jasmine.HtmlReporter(document.getElementById(id));
				jasmineEnv.updateInterval = 1000;
				jasmineEnv.addReporter(htmlReporter);
				jasmineEnv.specFilter = function(spec) {
					return htmlReporter.specFilter(spec);
				};
				jasmineEnv.execute();
			}, 2000)
		});
	},
	man: function() {
		return 'Runs jasmine tests.';
	}	
})