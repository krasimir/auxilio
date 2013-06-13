Commands.register("alias", {
	requiredArguments: 0,
	format: '<pre>alias [name]</pre>',
	aliases: {},
	run: function(args, callback) {
		var name = args.length > 0 ? args.shift() : null;
		var aliasValue = args.length > 0 ? args.join(" ") : null;
		var self = this;
		aliases = {};
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
					}, true);
				}
			} else {
				var str = '';
				for(var i in self.aliases) {
					str += '<h2>' + i + '</h2><pre>' + self.aliases[i] + '</pre>';
				}
				if(str != '') {
					exec('echo ' + str);
				} else {
					exec('echo No data.');
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
		alias [name] - openes an editor for adding or editing. If you leave the textarea empty and click \'OK\', the alias will be deleted.\
		';
	}	
})