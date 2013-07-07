Commands.register("warning", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'warning [text]',
		examples: [
			{text: 'Command line', code: 'warning Hello world!'},
			{text: 'In script', code: 'warning("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})