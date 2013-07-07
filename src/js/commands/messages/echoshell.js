Commands.register("echoshell", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular-shell">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'echoshell [text]',
		examples: [
			{text: 'Command line', code: 'echoshell Hello world!'},
			{text: 'In script', code: 'echoshell("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})