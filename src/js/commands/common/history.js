Commands.register("history", {
	requiredArguments: 0,
	format: '<pre>history</pre>',
	run: function(args, callback) {
		var message = 'History:<pre>';
		for(var i=App.commandsHistory.length-1; i>=0; i--) {
			var str = App.commandsHistory[i];
			if(str != '' && str != ' ') {
				message += str.toString().replace(/&/g, '&amp;') + "\n";
			}
		}
		message += '</pre>';
		exec('info ' + message, callback, true);
	},
	man: function() {
		return 'Outputs the current console\'s history.';
	}	
})