Commands.register("title", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><h1>' + this.formatter(args) + '</h1></div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'title [text]',
		examples: [
			{text: 'Command line', code: 'title Hello world!'},
			{text: 'In script', code: 'title("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})