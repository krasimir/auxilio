Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> ' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs error message.';
	}	
})