Commands.register("man", {
	requiredArguments: 0, 
	format: "<pre>man\nman [name of command]</pre>",
	run: function(args, callback) {
		var commandToViewName = args[0];
		if(commandToViewName) {
			for(var commandName in Commands) {
				var r = new RegExp(commandToViewName, "g");
				if(commandName != "get" && commandName != "register" && commandName.match(r)) {
					this.showCommand(commandName);
				}
			}
		} else {
			for(var commandName in Commands) {
				if(commandName != "get" && commandName != "register") {
					this.showCommand(commandName);
				}
			}
		}
		callback();
	},
	showCommand:function(commandName) {
		var c = Commands.get(commandName);
		var manual = c.man;
		if(typeof manual === 'object') {
			var examples = '';
			for(var i=0; e = manual.examples[i]; i++) {
				examples += e.text != '' ? '<p>' + e.text + '</p>': '';
				examples += '<pre>' + e.code + '</pre>';
			}
			var markup = '\
				<div class="manual">\
					<div class="c1">\
						<p class="title">' + commandName + '</p>\
						<p class="desc">' + manual.desc + '</p>\
						<p class="title-small">Format:</p>\
						<p>' + manual.format + '</p>\
						<p class="title-small">Returns:</p>\
						<p>' + manual.returns + '</p>\
					</div>\
					<div class="c2">\
						<p class="title"><i class="icon-right-hand"></i> Examples:</p>\
						' + examples + '\
					</div>\
					<br class="clear" />\
				</div>\
			';
			App.setOutputPanelContent(markup);
		}
	},
	man: function() {
		return 'Shows information about available commands.';
	}
});