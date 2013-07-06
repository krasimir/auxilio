Commands.register("clear", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: {
		desc: 'Clearing the current console\'s output.',
		format: 'clear',
		examples: [
			{text: '', code: 'clear'},
			{text: 'In script', code: 'clear()'}
		],
		returns: 'null',
		group: 'common'
	}
})