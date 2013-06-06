Commands.register("hidden", {
	requiredArguments: 1,
	format: '<pre>hidden [text]</pre>',
	run: function(args) {
		App.setOutputPanelContent('<div class="hidden">' + args.join(" ") + '</div>');
	},
	man: function() {
		return 'Outputs invisible content. I.e. useful when you have to add hidden html markup.';
	}	
})