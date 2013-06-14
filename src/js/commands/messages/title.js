Commands.register("title", {
	requiredArguments: 1,
	format: '<pre>title [text]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div><h1>' + args.join(" ") + '</h1></div>');
		callback();
	},
	man: function() {
		return 'Outputs a title.';
	}	
})