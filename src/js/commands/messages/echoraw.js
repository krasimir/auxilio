Commands.register("echoraw", {
	requiredArguments: 1,
	format: '<pre>echoraw [string]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		var output = args
		.join(" ")
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
		App.setOutputPanelContent('<div class="regular">' + output + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs message in raw format. Even the html is shown as string.';
	}	
})