Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="regular">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs message.';
	}	
})