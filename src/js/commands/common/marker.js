Commands.register("marker", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "marker"}, callback);
		}
	},
	man: {
		desc: 'Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.',
		format: 'marker',
		examples: [
			{text: 'Command line', code: 'marker'}
		],
		returns: 'null',
		group: 'common'
	}	
})