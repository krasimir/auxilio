Commands.register("hidden", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="hidden">' + args.join(" ") + '</div>');
		callback(args.join(" "));
	},
	man: {
		desc: 'Outputs invisible content. I.e. useful when you have to add hidden html markup.',
		format: 'hidden [text]',
		examples: [
			{text: 'Command line', code: 'hidden &lt;input type="hidden" name="property" />'},
			{text: 'In script', code: 'hidden("&lt;input type="hidden" name="property" />", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})