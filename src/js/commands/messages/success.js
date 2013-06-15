Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs success message.';
	}	
})