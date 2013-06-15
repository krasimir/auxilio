Commands.register("small", {
	requiredArguments: 1,
	format: '<pre>small [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs small message.';
	}	
})