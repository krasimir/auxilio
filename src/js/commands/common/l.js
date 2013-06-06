Commands.register("l", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: function() {
		return 'Clearing the current console\'s output.';
	}	
})