Commands.register("execl", {
	requiredArguments: 0,
	format: '<pre>execl</pre>',
	run: function(args, callback) {
		exec("formtextarea Command:", function(command) {
			command = command.replace(/\n/g, ' && ');
			exec(command, function(res) {
				callback(res);
			});
		});		
	},
	man: function() {
		return 'Executes a given command, but provides a textarea for writing it.';
	}	
})