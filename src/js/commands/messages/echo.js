Commands.register("echo", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'echo [text]',
		examples: [
			{text: 'Command line', code: 'echo Hello world!'},
			{text: 'In script', code: 'echo("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})