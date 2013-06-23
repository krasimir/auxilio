Commands.register("alias", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	format: '<pre>alias [name] [value]</pre>',
	aliases: {},
	run: function(args, callback) {
		var name = args.length > 0 ? args.shift() : null;
		var aliasValue = args.length > 0 ? args.join(" ").replace(/\\n/g, '\n') : null;
		var self = this;
		aliases = {};
		if(name === "clearallplease") {
			this.storeAliases(callback)
			return;
		}
		exec("storage get aliases", function(data) {
			if(data.aliases && data.aliases != "") {
				self.aliases = JSON.parse(data.aliases);
			}
			if(name) {
				var currentValue = self.aliases[name] || '';
				if(aliasValue) {
					self.aliases[name] = aliasValue;
					self.storeAliases(callback);
				} else {
					exec('formtextarea "alias:' + name + '" ' + currentValue, function(newValue) {
						if(newValue == null) { callback(); return; }
						if(newValue === '') { delete self.aliases[name]; }
						else { self.aliases[name] = newValue; }
						self.storeAliases(callback);
					});
				}
			} else {
				var str = '';
				for(var i in self.aliases) {
					str += '<h2>' + i + '</h2><pre>' + self.aliases[i] + '</pre>';
				}
				if(str != '') {
					exec('echo ' + str);
				} else {
					exec('info No data.');
				}
				callback();
			}
		});
	},
	storeAliases: function(callback) {
		exec("storage put aliases " + JSON.stringify(this.aliases), function() {
			exec('success Aliases saved succesfully.', function() {
				App.registerAliases();
				callback();
			});
		});
	},
	man: function() {
		return 'Managing aliases.<br />\
		alias - brings all the aliases<br />\
		alias [name] - openes an editor for adding or editing. If you leave the textarea empty and click \'OK\', the alias will be deleted.<br />\
		alias [name] [value] - directly pass the content of the alias<br />\
		alias clearallplease - clears all the added aliases\
		';
	}	
})