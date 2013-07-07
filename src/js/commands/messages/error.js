Commands.register("error", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'error [text]',
		examples: [
			{text: 'Command line', code: 'error Hello world!'},
			{text: 'In script', code: 'error("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})