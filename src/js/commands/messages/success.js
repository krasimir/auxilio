Commands.register("success", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'success [text]',
		examples: [
			{text: 'Command line', code: 'success Hello world!'},
			{text: 'In script', code: 'success("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})