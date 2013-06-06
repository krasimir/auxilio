Commands.register("history", {
	requiredArguments: 0,
	format: '<pre>history</pre>',
	run: function(args) {
		var message = 'History:<pre>';
		for(var i=App.commandsHistory.length-2; i>=0; i--) {
			message += App.commandsHistory[i] + '\n';
		}
		message += '</pre>';
		App.info(message);
	},
	man: function() {
		return 'Outputs the current console\'s history.';
	}	
})