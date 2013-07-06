Commands.register("hr", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><hr /></div>');
		callback();
	},
	man: function() {
		return 'Adds &lt;hr /> tag to the console\'s output panel';
	},
	man: {
		desc: 'Adds &lt;hr /> tag to the console\'s output panel',
		format: 'hr',
		examples: [
			{text: 'Command line', code: 'hr'},
			{text: 'In script', code: 'hr();'}
		],
		returns: 'null',
		group: 'messages'
	}	
})