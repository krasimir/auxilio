Commands.register("alias", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
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
		if(name === "exportallplease") {
			this.exportAliases(callback)
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
				var names = [];
				for(var i in self.aliases) {
					names.push(i);
				}
				names.sort();
				for(var i=0; a = names[i]; i++) {
					str += '<a href="#" data="' + a + '" class="js-alias-list-link">' + a + '</a> ';
					str += '<a href="#" data="' + a + '" class="js-alias-list-link-view"><i class="icon-eye"></i><br /></a>';
				}
				if(str != '') {
					exec('echo ' + str);
					setTimeout(function() {	
						var links = document.querySelectorAll(".js-alias-list-link");
						for(var i=0; link=links[i]; i++) {
							link.addEventListener("click", function(e) {
								exec(e.target.getAttribute("data"));
							});
						}
						var linksView = document.querySelectorAll(".js-alias-list-link-view");
						for(var i=0; linkView=linksView[i]; i++) {
							(function(data, linkView) {
								linkView.addEventListener("click", function(e) {
									linkView.innerHTML = '<pre>' + self.aliases[data] + '</pre>';
								});
							})(linkView.getAttribute("data"), linkView);
						}
					}, 100);
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
	exportAliases: function(callback) {
		exec("storage get aliases", function(data) {
			var result = '';
			if(data.aliases && data.aliases != "") {
				self.aliases = JSON.parse(data.aliases);
				var names = [];
				for(var i in self.aliases) {
					names.push(i);
				}
				names.sort();
				for(var i=0; name=names[i]; i++) {
					result += 'alias ' + name + ' ' + self.aliases[name].toString().replace(/\n/g, "\\n") + '\n';
				}
			}
			callback(result);
		});
	},
	man: {
		desc: 'Managing aliases.',
		format: 'alias [name] [value]',
		examples: [
			{text: 'Showing current added aliases', code: 'alias'},
			{text: 'Opening an editor for adding alias', code: 'alias my-alias-name'},
			{text: 'Directly pass the content of the alias', code: 'alias my-alias-name date && echo'},
			{text: 'Clearing all aliases', code: 'alias clearallplease'},
			{text: 'Exporting all aliases', code: 'alias exportallplease'},
			{text: 'Command line (chaining)', code: 'readfile showing-date.aux && exec'},
			{text: 'In script', code: 'alias(\'"my-alias-name"\', "date && echo", function() {\n\
	console.log("Alias added.");\n\
})'}
		],
		returns: 'Check the examples.',
		group: 'data'
	}	
})