Commands.register("l", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: function() {
		return '';
	},
	man: {
		desc: 'Clearing the current console\'s output.',
		format: 'l',
		examples: [
			{text: 'Just type <i>l</i> and press Enter', code: 'l'}
		],
		returns: 'null',
		group: 'common'
	}	
})