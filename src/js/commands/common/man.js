Commands.register("man", {
	requiredArguments: 0, 
	format: "<pre>man\nman [name of command]</pre>",
	run: function(args, callback) {
		var commandName = args[0];
		if(commandName) {
			this.showCommand(commandName);
		} else {
			for(var commandName in Commands) {
				this.showCommand(commandName);
			}
		}
		callback();
	},
	showCommand:function(commandName) {
		var c = Commands.get(commandName);
		if(c) {
			var message = '(<b>' + commandName + '</b>) ' + (c.man ? c.man() : '');
			c.format && c.format != '' ? message += '<br />' + c.format : null;
			App.execute("echo " + message);
		}
	},
	man: function() {
		return 'Shows information about available commands.';
	}
})