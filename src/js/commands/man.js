Commands.register("man", {
	requiredArguments: 0, 
	format: "<pre>man\nman [name of command]</pre>",
	run: function(args) {
		var commandName = args[0];
		if(commandName) {
			this.showCommand(commandName);
		} else {
			for(var commandName in Commands) {
				this.showCommand(commandName);
			}
		}
	},
	showCommand:function(commandName) {
		var c = Commands[commandName];
		if(c) {
			var message = '(<b>' + commandName + '</b>) ' + (c.man ? c.man() : '');
			c.format && c.format != '' ? message += '<br />' + c.format : null;
			App.echo(message);
		} else {
			App.error('man: there is no command with name <b>' + commandName + '</b>');
		}
	},
	man: function() {
		return 'Shows information about available commands.';
	}
})