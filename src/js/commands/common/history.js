Commands.register("history", {
	requiredArguments: 0,
	format: '<pre>history</pre>',
	run: function(args, callback) {
		var message = 'History:<pre>';
		for(var i=App.commandsHistory.length-2; i>=0; i--) {
			if(!App.isMessageCommand(App.commandsHistory[i])) {
				message += App.commandsHistory[i] + '\n';
			}
		}
		message += '</pre>';
		App.execute("info " + message, callback);
	},
	man: function() {
		return 'Outputs the current console\'s history.';
	}	
})