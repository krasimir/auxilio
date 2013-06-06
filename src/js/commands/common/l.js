Commands.register("l", {
	run: function() {
		App.clear();
	},
	man: function() {
		return 'Clearing the current console\'s output.';
	}	
})