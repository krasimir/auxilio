Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs info message.';
	}	
})