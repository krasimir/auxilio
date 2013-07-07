Commands.register("man", {
	requiredArguments: 0,
	run: function(args, callback) {
		var commandToViewName = args.shift();
		if(commandToViewName) {
			if(commandToViewName === "exporttomarkdown") {
				var groups = this.getCommandsSortedByGroup();
				var markdown = '# Auxilio commands\n\n';
				for(var groupName in groups) {
					markdown += '- - -\n\n';
					markdown += '## ' + groupName + '\n\n';
					for(var i=0; command = groups[groupName][i]; i++) {
						markdown += '### ' + command.name + "\n\n";
						markdown += command.man.desc + "\n\n";
						markdown += "  - format: " + command.man.format + "\n";
						markdown += "  - returns: " + command.man.returns + "\n";
						markdown += "\n#### Examples:\n\n";
						for(var j=0; example = command.man.examples[j]; j++) {
							var code = example.code.replace(/</g, '&lt;').replace(/&&/g, '&amp;&amp;');
							markdown += example.text + "\n";
							markdown += "<pre>" + code + "</pre>\n";
						}
					}
				}
				writefile("commands.md", markdown, callback);
				return;
			} else {
				for(var commandName in Commands) {
					var r = new RegExp(commandToViewName, "g");
					if(commandName != "get" && commandName != "register" && commandName.match(r)) {
						this.showCommand(commandName);
					}
				}
			}
		} else {
			var groups = this.getCommandsSortedByGroup();
			var markup = '<h1>Auxilio manual pages</h1><div class="man-holder">';
			for(var groupName in groups) {
				markup += '<div class="man-group">';
				markup += '<h2>' + groupName + '</h2>';
				for(var i=0; command = groups[groupName][i]; i++) {
					markup += '<a href="javascript:void(0)" class="man-group-link" data="' + command.name + '">' + command.name + '</a><br />';
				}
				markup += '</div>';
			}
			markup += '<br class="clear" />';
			markup += '</div>';
			exec("echo " + markup, function() {
				var links = document.querySelectorAll(".man-group-link");
				for(var i=0; link=links[i]; i++) {
					link.addEventListener("click", function(e) {
						exec("man " + e.target.getAttribute("data"));
					})
				}
			});
		}
		callback();
	},
	getCommandsSortedByGroup: function() {
		var groups = {}
		for(var commandName in Commands) {
			var c = Commands[commandName];
			if(c.man && c.man.group) {
				if(!groups[c.man.group]) groups[c.man.group] = [];
				groups[c.man.group].push({name: commandName, man: c.man});
			}
		}
		return groups;
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
	man: {
		desc: 'Shows manual page about available commands.',
		format: 'man<br />man [regex | name of a command]<br />man exporttomarkdown',
		examples: [
			{text: 'Command line', code: 'man'}
		],
		returns: 'Manual page/s',
		group: 'common'
	}
});