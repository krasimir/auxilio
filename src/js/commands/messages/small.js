Commands.register("small", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'small [text]',
		examples: [
			{text: 'Command line', code: 'small Hello world!'},
			{text: 'In script', code: 'small("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})