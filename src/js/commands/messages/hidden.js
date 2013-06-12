Commands.register("hidden", {
	requiredArguments: 1,
	format: '<pre>hidden [text]</pre>',
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] === 'object') {
				args[i] = JSON.stringify(args[i]);
			}
		}
		App.setOutputPanelContent('<div class="hidden">' + args.join(" ") + '</div>');
		callback();
	},
	man: function() {
		return 'Outputs invisible content. I.e. useful when you have to add hidden html markup.';
	}	
})