Commands.register("echoraw", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args, true, true, true) + '</div>');
		callback(this.formatter(args, true, true, true));
	},
	man: {
		desc: 'Outputs message in raw format. Even the html is shown as string.',
		format: 'echoraw [text]',
		examples: [
			{text: 'Command line', code: 'echoraw Hello world!'},
			{text: 'In script', code: 'echoraw("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})