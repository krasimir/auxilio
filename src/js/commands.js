Commands.register("clear", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: {
		desc: 'Clearing the current console\'s output.',
		format: 'clear',
		examples: [
			{text: '', code: 'clear'},
			{text: 'In script', code: 'clear()'}
		],
		returns: 'null',
		group: 'common'
	}
})
Commands.register("compare", {
	requiredArguments: 4,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var title = args.shift();
		var value1 = this.prepareValue(args.shift().toString());
		var expression = args.shift();
		var value2 = this.prepareValue(args.shift().toString());
		var success = false;
		if(expression === "==" || expression === "===") {
			success = value1 === value2;
		} else if(expression === ">") {
			success = value1 > value2;
		} else if(expression === "<") {
			success = value1 < value2;
		} else if(expression === ">=") {
			success = value1 >= value2;
		} else if(expression === "<=") {
			success = value1 <= value2;
		} else if(expression === "!=" || expression === "!==") {
			success = value1 !== value2;
		} else {
			exec("error compare: Unrecognized expression. (" + expression + ")");
			callback(success);
			return;
		}
		if(success) {
			exec("success " + title + "<br />" + value1 + " " + expression + " " + value2);
		} else {
			exec("error " + title + "<br />" + value1 + " " + expression + " " + value2);
		}
		callback(success);
	},
	prepareValue: function(v) {
		if(isNaN(v) === true) {
			return v.toString();
		} else {
			return parseInt(v);
		}
	},
	man: {
		desc: 'Compares values. (Have in mind that it works only with strings and numbers.)',
		format: 'compare [title] [value1] [expression] [value2]',
		examples: [
			{text: 'Command line', code: 'compare "Check those values" 10 == 20'},
			{text: 'Command line (chaining)', code: 'date true && read monthName && compare "Is it July?" July =='},
			{text: 'In script', code: 'compare(\'"My title here"\', 10, "==", 10, function(res) {\n\
	console.log(res);\n\
})'},
		],
		returns: 'Boolean (true | false)',
		group: 'common'
	}
})
Commands.register("date", {
	requiredArguments: 0,
	format: '<pre></pre>',
	run: function(args, callback) {
		var asObject = args.length > 0 ? args.shift() === "true" : false;
		var currentDate = new Date();
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if(asObject) { 
			callback({
				year: currentDate.getFullYear(),
				month: currentDate.getMonth(),
				monthName: months[currentDate.getMonth()],
				day: currentDate.getDate(),
				hour: currentDate.getHours(),
				minutes: currentDate.getMinutes()
			});
		} else {
			var str = '';
			str += currentDate.getDate() + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear();
			str += ' ';
			str += this.formatDigit(currentDate.getHours()) + ":" + this.formatDigit(currentDate.getMinutes());
			callback(str);
		}
	},
	formatDigit: function(d) {
		if(d < 10) {
			return "0" + d;
		} else {
			return d;
		}
	},
	man: {
		desc: 'Gets the current date.',
		format: 'date [true | false]',
		examples: [
			{text: 'Command line', code: 'date'},
			{text: 'Command line (chaining)', code: 'date true && read monthName && info'},
			{text: 'In script', code: 'date("true", function(date) {\n\
	console.log(date.year);\n\
})'}
		],
		returns: 'String if you use just <i>date</i> and object if use <i>data true</i><pre>6 July 2013 14:43</pre><pre>\
Object {\n\
	day: 6\n\
	hour: 14\n\
	minutes: 41\n\
	month: 6\n\
	monthName: "July"\n\
	year: 2013\n\
}\
		</pre>',
		group: 'common'
	}	
})
Commands.register("delay", {
	requiredArguments: 1,
	run: function(args, callback) {
		var interval = parseInt(args.shift());
		setTimeout(function() {
			callback();
		}, interval)
	},
	man: {
		desc: 'Delays the next command',
		format: 'delay [miliseconds]',
		examples: [
			{text: 'Command line', code: 'delay 2000'},
			{text: 'Command line (chaining)', code: 'echo A && delay 2000 && echo B'},
			{text: 'In script', code: 'delay(2000, function() {\n\
	console.log("hello");\n\
})'}
		],
		returns: 'null',
		group: 'common'
	}	
})
Commands.register("diff", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		if(args.length >= 2) {
			var self = this;
			var file1 = args[0];
			var file2 = args[1];
			exec("readfile " + file1, function(resFile1) {
				exec("readfile " + file2, function(resFile2) {
					var file1Ext = self.getExt(file1);
					var file2Ext = self.getExt(file2);
					if(file1Ext === file2Ext && file1Ext === "json") {
						var file1JSON, file2JSON;
						try {
							file1JSON = JSON.parse(resFile1);
						} catch(e) {
							exec("error File " + file1 + " contains invalid json.");
							callback();
							return;
						}
						try {
							file2JSON = JSON.parse(resFile2);
						} catch(e) {
							exec("error File " + file2 + " contains invalid json.");
							callback();
							return;
						}
						self.compareJSON(file1JSON, file2JSON, callback);
					} else {
						self.compareText(resFile1, resFile2, callback);
					}
				})
			});
		} else {
			exec("error Sorry, but <i>diff</i> requires two arguments.")
		}
		// this.compareText("Krasimir Tsonev is web developer", "Krasimir tyonev is developer", callback);
		// this.compareJSON({a: 20}, {a: 20, b: { c: 20 }}, callback);
	},
	compareJSON: function(ob1, ob2, callback) {
		var diff = objectDiff.diffOwnProperties(ob1, ob2);		
		var markup = '<pre>' + objectDiff.convertToXMLString(diff) + '</pre>';
		exec("echo " + markup);
		callback(diff);
	},
	compareText: function(t1, t2, callback) {
		var dmp = new diff_match_patch();
		var d = dmp.diff_main(t1, t2);
		// dmp.diff_cleanupSemantic(d);
		// dmp.diff_cleanupEfficiency(d);
		var result = '';
		var diff = dmp.diff_prettyHtml(d);
		result += 'Difference:<pre>' + diff + '</pre>';
		// result += 'Text #1:<pre>' + t1 + '</pre>';
		// result += 'Text #2:<pre>' + t2 + '</pre>';
		exec("echo " + result);
		callback(d);
	},
	getExt: function(filename) {
		var parts = filename.split(".");
		return parts[parts.length-1].toLowerCase();
	},
	man: {
		desc: 'Comparison of files (text and json).',
		format: 'diff [file1] [file2]',
		examples: [
			{text: 'Compare two files', code: 'diff ./file1.txt ./file2.txt'},
			{text: 'In script', code: 'diff(\'"file1.txt"\', \'"file2.txt"\', function(res) {\n\
	console.log(res);\n\
})'}
		],
		returns: 'Object containing the differences.',
		group: 'common'
	}
})
Commands.register("exec", {
	requiredArguments: 1,
	run: function(args, callback) {
		var strToExecute = args.join(" ");
		if(strToExecute.indexOf('\n') >= 0) {
			strToExecute = strToExecute.join(" ").replace(/\n/g, ' && ');
		}
		exec(args.join(" "), function(res) {
			callback(res);
		});
	},
	man: {
		desc: 'Executes a given command. Accepts commands separated by <i>&&</i>.',
		format: 'exec [command/s]',
		examples: [
			{text: 'Command line', code: 'exec echo "test"'},
			{text: 'Command line (chaining)', code: 'readfile showing-date.aux && exec'},
			{text: 'In script', code: 'exec("echo Hello world! && date true", function(res) {\n\
	console.log(res);\n\
})'}
		],
		returns: 'The result of the executed command.',
		group: 'common'
	}
})
Commands.register("history", {
	requiredArguments: 0,
	format: '<pre></pre>',
	run: function(args, callback) {
		var message = 'History:<pre class="history-panel">';
		for(var i=App.commandsHistory.length-2; i>=0; i--) {
			var str = App.commandsHistory[i];
			if(str != '' && str != ' ') {
				var linkId = _.uniqueId("historylink");
				message += "<a href='#' id='" + linkId + "'>" + str.toString().replace(/&/g, '&amp;') + "</a>\n";
				(function(command, linkId){
					setTimeout(function() {
						document.querySelector("#" + linkId).addEventListener("click", function() {
							exec(command);
						});
					}, 200);
				})(str, linkId);
			}
		}
		message += '</pre>';
		exec('info ' + message, callback);
	},
	man: {
		desc: 'Outputs the current console\'s history.',
		format: 'history',
		examples: [
			{text: 'Command line', code: 'history'}
		],
		returns: 'null',
		group: 'common'
	}	
})
Commands.register("l", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: function() {
		return '';
	},
	man: {
		desc: 'Clearing the current console\'s output.',
		format: 'l',
		examples: [
			{text: 'Just type <i>l</i> and press Enter', code: 'l'}
		],
		returns: 'null',
		group: 'common'
	}	
})
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
Commands.register("marker", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "marker"}, callback);
		}
	},
	man: {
		desc: 'Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.',
		format: 'marker',
		examples: [
			{text: 'Command line', code: 'marker'}
		],
		returns: 'null',
		group: 'common'
	}	
})
Commands.register("middleman", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback(args);
	},
	man: {
		desc: 'The command simply passes the given argument to its callback',
		format: 'middleman [resource]',
		examples: [
			{text: 'Command line (chaining)', code: 'date && middleman && echo'}
		],
		returns: 'The result of the previous command in the chain.',
		group: 'common'
	}	
})
Commands.register("pass", {
	requiredArguments: 1,
	format: '<pre></pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback();
	},
	man: {
		desc: 'Sometimes is needed to stop passing a result from one command to another. This command simply calls its callback without any arguments.',
		format: 'pass',
		examples: [
			{text: 'Command line (chaining)', code: 'date true && pass && echo That\'s a string without date.'}
		],
		returns: 'null',
		group: 'common'
	}	
})
Commands.register("read", {
	requiredArguments: 2,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.shift();
		var obj = args.shift();

		if(typeof obj == 'object' && path != '') {

			var parse = function(currentPath, o) {
				if(currentPath.length === 0) {
					callback(o);
					return;
				}
				var part = currentPath.shift(),
					index = null,
					arrName = null;
				if(part.indexOf("[") >= 0 && part.indexOf("]") > 0) {
					var subParts = part.split('[');
					var arrName = subParts.shift();
					var index = parseInt(subParts.shift().replace(']', ''));
				}
				if(index !== null) {
					if(o[arrName] && typeof o[arrName].length !== 'undefined' && o[arrName][index]) {
						parse(currentPath, o[arrName][index]);
					} else {
						exec('error read: wrong path (error working with arrays)');
					}
				} else {
					if(o[part]) {
						parse(currentPath, o[part]);
					} else {
						exec('error read: wrong path');
						callback();
					}
				}
			}

			parse(path.split('.'), obj);

		} else {
			exec('error Second argument of read should be an object.');
			callback();
		}
	},
	man: {
		desc: 'Extracts a value from json object',
		format: 'read [path] [json object]',
		examples: [
			{text: 'Command line (chaining)', code: 'date true && read day && success Today is '},
			{text: 'If you have a complex object like this one {data: { users: [10, 11, 12] }}', code: 'read data.users[1]'},
		],
		returns: 'Value of a property of the sent object',
		group: 'common'
	}	
});
Commands.register("request", {
	requiredArguments: 1,
	run: function(args, finished) {
		var self = this;
		var url = args.shift();
		var showRawOutput = args.length > 0 && args[0] === "true";
		if(url.indexOf("http") == -1) url = "http://" + url;
		var callback = function(response) {
			if(response.error) {
				exec('error request: ' + response.error, finished);
			} else {
				var responseText = response.responseText;
				if(!showRawOutput) {
					responseText = responseText.replace(/</g, '&lt;');
					responseText = responseText.replace(/>/g, '&gt;');
					responseText = '<pre>' + responseText + '</pre>';
				}
				finished(responseText);
			}
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "request", url: url}, callback);
		} else {
			request(url, callback);
		}
	},
	man: {
		desc: 'Sends ajax request and returns the result.',
		format: 'request [url]<br />request [url] [raw (true | false)]',
		examples: [
			{text: 'Command line', code: 'request github.com && echo'},
			{text: 'Getting raw html', code: 'request github.com true && echo'},
			{text: 'In script', code: 'This command is not supported in external scripts.'}
		],
		returns: 'Response of the given url or the raw output if <i>raw</i> parameter is passed.',
		group: 'common'
	}
})

// Used in development mode
var request = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback({responseText: xhr.responseText});
		} else if(xhr.readyState == 4) {
			callback({error: "Error requesting '" + url + "'. (xhr.status=" + xhr.status + ")"});
		}
	}
	xhr.send();
}
Commands.register("stringify", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		for(var i=0; i<args.length; i++) {
			if(typeof args[i] !== "string" && typeof args[i] !== "number") {
				args[i] = JSON.stringify(args[i]);
			}
		}
		callback(args.join(" "));
	},
	man: {
		desc: 'Just bypasses the given arguments as string',
		format: 'stringify [text or object]',
		examples: [
			{text: 'Command line', code: 'date true && stringify && info'}
		],
		returns: 'string',
		group: 'common'
	}	
})
var VarStorage = {};
var ApplyVariables = function(str) {
	for(var name in VarStorage) {
		var r = new RegExp("\\$\\$" + name, 'g');
		str = str.replace(r, VarStorage[name]);
	}
	return str;
}
Commands.register("var", {
	requiredArguments: 0,
	format: '<pre>var [name] [value]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var name = args.length > 0 ? args.shift() : false;
		var value = args.length > 0 ? args.join(' ') : false;
		if(name === false) {
			for(var name in VarStorage) {
				exec("echo " + name + ": <pre>" + VarStorage[name] + "</pre>");
			}
			callback();
			return;
		} else if(value === false) {
			if(VarStorage[name]) {
				value = VarStorage[name];
			} else {
				exec("error There is no variable with name <i>" + name + "</i>.");
			}
		} else {
			VarStorage[name] = value;
			Autocomplete.prepareDictionary();
		}
		callback(value);
	},
	man: {
		desc: 'Define a variable.',
		format: 'var [name] [value]',
		examples: [
			{text: 'Command line', code: 'var n 10\necho $$n is a great position'},
			{text: 'Command line (chaining)', code: 'date && var currentDate\necho Current date is $$currentDate'},
		],
		returns: 'The value of the variable',
		group: 'common'
	}	
})
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
var Profile = (function() {

	var init = function() {
		var onSocketConnect = function() {
			exec("profile", function(path) {
				if(path && path !== '') {
					exec("run " + path);
				}
			});
			Shell.socket().removeListener("updatecontext", onSocketConnect);
		}
		Shell.socket().on("updatecontext", onSocketConnect);
	}

	return {
		init: init
	}

})();

Commands.register("profile", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		var self = this;
		if(path === '') {
			exec("storage get profiledata", function(data) {
				if(data.profiledata && data.profiledata !== "") {
					callback(data.profiledata);
				} else {
					callback(null);
				}
			});
		} else if(path === 'clear') {
			exec("storage remove profiledata " + path, function() {				
				exec('success Profile removed.', callback);
			});
		} else {
			exec("storage put profiledata " + path, function() {
				Profile.init();
				exec('success Profile changed successfully.', callback);
			});
		}
	},
	man: {
		desc: 'Manages your current profile file. Every time when you start auxilio the extension reads the files of the given directory (recursively). It searches for files which start with <i>function </i> and register them as commands. If the file starts with <i>exec.</i> directly executes the function inside the file. Check <i>man run</i> for more information.',
		format: 'profile [path]',
		examples: [
			{text: 'Getting current profile path', code: 'profile'},
			{text: 'Setting profile', code: 'profile D:/work/auxilio/profile'},
			{text: 'Clearing profile', code: 'profile clear'}
		],
		returns: 'Check examples.',
		group: 'data'
	}	
})
Commands.register("storage", {
	requiredArguments: 1,
	lookForQuotes: false,
	run: function(args, callback) {
		var operation = args.shift();
		var key = args.length > 0 ? args.shift() : null;
		var value = args.length > 0 ? args.join(" ") : null;
		if(operation !== "put" && operation != "get" && operation != "remove") {
			exec("error profile: Operation parameter could be 'put', 'get' or 'remove' (not '" + operation + "').");
			callback();
			return;
		}
		if((operation === "put" || operation === "remove") && !key) {
			exec("error profile: 'key' is missing.");
			callback();
			return;
		}
		if(operation === "put" && !value) {
			exec("error profile: 'put' operation used, but 'value' is missing.");
			callback();
			return;
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "storage", operation: operation, key: key, value: value}, function(res) {
				if(res.error) {
					exec("error " + error.error);
				} else {
					if(operation === "get") {
						// exec("info " + JSON.stringify(res.value))
						callback(res.value);
					} else {
						callback();
					}
				}
			});
		}
	},
	man: {
		desc: 'Stores key-value pairs by using chrome.storage.sync API.',
		format: 'storage [operation] [key] [value]',
		examples: [
			{text: 'Storing variable', code: 'storage put username Auxilio'},
			{text: 'Getting variable', code: 'storage get username'},
			{text: 'Removing variable', code: 'storage remove username'},
			{text: 'Get all variable', code: 'storage get'}
		],
		returns: 'The result of the executed command.',
		group: 'data'
	}	
})
var Editor = (function() {

	var _files = [],
		_id = "editor",
		_added = false,
		_editorHolder = null,
		_editor = null,
		_currentFile = null,
		_editorToolbar = null;

	var _markup = '\
		<div class="editor-ace">\
			<div id="' + _id + '" class="editor"></div>\
			<div class="editor-toolbar"></div>\
			<div class="editor-hint">\
			Ctrl+S = save, \
			Esc = close, \
			Ctrl+[ = previous project, \
			Ctrl+] = next project</div>\
		</div>\
	';

	var addEditor = function() {
		if(!_added) {
			_editorHolder = document.querySelector(".editor-holder");
			_editorHolder.innerHTML = _markup;
			_editor = ace.edit(_id);
		    _editor.setTheme("ace/theme/textmate");
		    _editor.getSession().setMode("ace/mode/javascript");
		    _editor.getSession().setUseWrapMode(true);
		    _editor.getSession().setUseWorker(false);
		    _editor.focus();
		    _editor.commands.addCommand({
			    name: 'Save',
			    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
			    exec: function(editor) {
			        save();
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'Close',
			    bindKey: {win: 'Esc',  mac: 'Esc'},
			    exec: function(editor) {
			        close();
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'PreviousFile',
			    bindKey: {win: 'Ctrl+[',  mac: 'Ctrl+['},
			    exec: function(editor) {
			        if(_currentFile == 0) {
			        	changeCurrentFile(_files.length-1);
			        } else {
			        	changeCurrentFile(_currentFile-1);
			        }
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'NextFile',
			    bindKey: {win: 'Ctrl+]',  mac: 'Ctrl+]'},
			    exec: function(editor) {
			        if(_currentFile == _files.length-1) {
			        	changeCurrentFile(0);
			        } else {
			        	changeCurrentFile(_currentFile+1);
			        }
			    },
			    readOnly: true
			});
			_editorToolbar = document.querySelector(".editor-toolbar");
		}
	}
	var addFile = function(file) {
		exec("readfile " + file, function(content) {
			if(typeof content === 'object') {
				content = content.content;
			}
			if(content !== null) {
				_files.push({
					file: Context.get() + "/" + file,
					content: content
				});
				_currentFile = _files.length-1;
				showCurrentFile();
			}
		});
	}
	var showCurrentFile = function() {
		addEditor();
		_editor.setValue(_files[_currentFile].content);
		_editor.setReadOnly(false);
		_editor.clearSelection();
		updateToolbar();
		if(_files[_currentFile].position) {
			_editor.selection.moveCursorToPosition(_files[_currentFile].position);
		} else {
			_editor.selection.moveCursorToPosition({row: 0, column: 0});
		}
	}
	var save = function() {
		_files[_currentFile].content = _editor.getValue();
		exec("writefile " + _files[_currentFile].file + " " + _files[_currentFile].content);
	}
	var close = function() {
		_editorHolder.innerHTML = '';
		_added = false;
		_files = [];
		setTimeout(function() {
			App.setFocus();
		}, 200);
	}
	var updateToolbar = function() {
		var str = '';
		for(var i=0; file = _files[i]; i++) {
			str += '<a href="javascript:void(0);" data-index="' + i + '"\
			class="editor-file' + (i == _currentFile ? ' current-file' : '') + '">' + file.file.replace(/\\/g,'/').replace( /.*\//, '' ) + '</a>';
		}
		_editorToolbar.innerHTML = str;
		var links = document.querySelectorAll(".editor-file");
		for(var i=0; link = links[i]; i++) {
			link.addEventListener("click", function(e) {
				changeCurrentFile(parseInt(e.target.getAttribute("data-index")));
			});
		}
	}
	var changeCurrentFile = function(index) {
		if(_files[_currentFile]) {
			_files[_currentFile].position = _editor.selection.getCursor();
		}
		_currentFile = index;
		showCurrentFile();
	}

	return {
		addFile: addFile
	}

})();

Commands.register("editor", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	editor: null,
	editorHolder: null,
	run: function(args, callback) {
		Editor.addFile(args.shift());
		callback();
	},
	man: {
		desc: 'Opens an editor for editing files. Available shortcuts:<br />\
		Ctrl+S - save<br />\
		Esc - closing the editor<br />\
		Ctrl+[ - showing previous file<br />\
		Ctrl+] - showing next file<br />\
		',
		format: 'editor [file]',
		examples: [
			{text: 'Open file for editing', code: 'editor ./styles.css'}
		],
		returns: 'null',
		group: 'develop'
	}	
});

// setTimeout(function() {
// 	exec("editor README.md", function() {
// 		exec("editor index.js");
// 	});
// }, 500);

/*

	Ace themes:
	ambiance
	chaos
	chrome
	clouds +
	clouds_midnight
	cobalt
	crimson_editor
	dawn
	dreamweaver
	eclipse
	github +
	idle_fingers
	kr_theme
	merbivore
	merbivore_soft
	mono_industrial
	monokai
	pastel_on_dark
	solarized_dark
	solarized_light
	terminal
	textmate ++ 
	tomorrow
	tomorrow_night
	tomorrow_night_blue
	tomorrow_night_bright
	tomorrow_night_eighties
	twilight
	vibrant_ink
	xcode

*/

Commands.register("jshint", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var data = args.shift();
		if(data.jshint && typeof data.jshint === 'object') {
			var jshintData = data.jshint;
			if(jshintData.errors && jshintData.errors.length > 0) {
				var str = 'JSHint (<b>' + data.filePath + '</b>): <br />';
				for(var i=0; error = jshintData.errors[i]; i++) {
					str += error.line + ':' + error.character + ' -> ' + error.reason + ' -> ' + error.evidence + '<br />';
				}
				exec("error " + str);
			} else {
				this.noError(data.filePath);
			}
		} else {
			this.noError(data.filePath);
		}
		callback(data);
	},
	noError: function(filePath) {
		if(filePath && filePath.split('.').pop().toLowerCase() === '.js') {
			exec("success JSHint: No errors in <b>" + filePath + "</b>.");
		}
	},
	man: {
		desc: 'Formats an output of jshint execution. The command is meant to be used together with <i>watch</i>.',
		format: 'jshint [{filePath: [path], jshint: [jshint]}]',
		examples: [
			{text: 'Watching a javascript file for changes and passing the result to jshint.', code: 'watch start ./code.js jshint'}
		],
		returns: 'null',
		group: 'develop'
	}	
})
Commands.register("runjasmine", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		var id = _.uniqueId("jasminetest");
		(function(id) {
			var markup = '<div id="' + id + '"></div>';
			App.setOutputPanelContent(markup);
			exec("run " + path, function(totalFilesProcessed) {
				var jasmineEnv = jasmine.getEnv();
				var htmlReporter = new jasmine.HtmlReporter(null, document.getElementById(id));
				jasmineEnv.updateInterval = 1000;
				jasmineEnv.clearReporters();
				jasmineEnv.addReporter(htmlReporter);
				jasmineEnv.specFilter = function(spec) {
					return htmlReporter.specFilter(spec);
				};
				jasmineEnv.execute();
			});
		})(id);
		callback();
	},
	man: {
		desc: 'Runs jasmine tests.',
		format: 'runjasmine [path]',
		examples: [
			{text: 'Command line', code: 'runjasmine ./tests'}
		],
		returns: 'null',
		group: 'develop'
	}	
})
Commands.register("formconfirm", {
	requiredArguments: 1,
	run: function(args, callback) {
		
		var id = _.uniqueId("formconfirm");
		var question = args.join(" ");
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_buttonno" class="btn deny"><i class="icon-ok"></i> NO</a>\
					<a href="#" id="' + id + '_buttonyes" class="btn confirm"><i class="icon-ok"></i> YES</a>\
				</div>\
				<h1>' + question + '</h1>\
				<span class="clear" />\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var buttonYes = document.getElementById(id + '_buttonyes');
		var buttonNo = document.getElementById(id + '_buttonno');
		buttonYes.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback(true);
			App.commandInputFocus();
		});
		buttonNo.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback(false);
			App.commandInputFocus();
		});

	},
	man: {
		desc: 'Shows a text (question) with two options - YES and NO.',
		format: 'formconfirm [question]',
		examples: [
			{text: 'Command line', code: 'formconfirm Are you sure?'},
			{text: 'In script', code: 'formconfirm(\'"Are you sure?"\', function(res) {\n\
	console.log(res ? "yes" : "no");\n\
});'}
		],
		returns: 'Boolean (true | false)',
		group: 'forms'
	}	
})
Commands.register("formfile", {
	requiredArguments: 0,
	run: function(args, callback) {
		
		var id = _.uniqueId("formfile");
		var title = args.length > 0 ? args.join(' ') : "Please choose file/s:";
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<input type="file" id="' + id + '_area" class="clear" />\
				<div class="file-content" id="' + id + '_filecontent"></div>\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var area = document.getElementById(id + '_area');
		var fileContent = document.getElementById(id + '_filecontent');
		var value = null;
		area.addEventListener("change", function(e) {
			var files = e.target.files;
			var file = null;
			if(file = files[0]) {
				var reader = new FileReader();
				reader.onload = function(e) {
					if(e.target.result) {
						value = e.target.result;
						fileContent.style.display = "block";
						fileContent.innerText = value;
					}
				};
				reader.readAsText(file);
			}
		})
		button.addEventListener("click", function() {
			if(value != null) {
				form.parentNode.style.display = "none";
				callback(value);
				App.commandInputFocus();
			} else {
				exec("error Please choose a file.")
			}
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});

	},
	man: {
		desc: 'Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.',
		format: 'formfile [title]',
		examples: [
			{text: 'Command line', code: 'formfile Please choose a file.'},
			{text: 'In script', code: 'formfile(\'"Please choose a file."\', function(fileContent) {\n\
	console.log(fileContent);\n\
})'}
		],
		returns: 'Content of the file',
		group: 'forms'
	}	
})
Commands.register("forminput", {
	requiredArguments: 0,
	run: function(args, callback) {
		
		var id = _.uniqueId("forminput");
		var title = args.length > 0 ? args.shift() : "Type something:";
		var text = args.length > 0 ? args.join(" ") : '';
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<input type="text" id="' + id + '_area" class="clear" value="' + text + '"/>\
				<small class="form-hint">Ctrl+Enter = OK, Esc = CANCEL</small>\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var textarea = document.getElementById(id + '_area');
		var onKeyDown = function(e) {
			if(e.ctrlKey && e.keyCode === 13) {
				button.click();
			} else if(e.keyCode == 27) {
				buttonCancel.click();
			}
		}

		textarea.focus();
		button.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			var value = textarea.value.replace(/ && /g, '\n');
			callback(value);
			textarea.removeEventListener("keydown", onKeyDown);
			App.commandInputFocus();
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});
		textarea.addEventListener("keydown", onKeyDown);

	},
	man: {
		desc: 'Shows a simple form with input and button.',
		format: 'forminput<br />forminput [title]<br />forminput [title] [default text]',
		examples: [
			{text: 'Command line', code: 'forminput "Please type your age." 18'},
			{text: 'In script', code: 'forminput(\'"Please type your age."\', 18, function(age) {\n\
	console.log(age);\n\
});'}
		],
		returns: 'string',
		group: 'forms'
	}	
})
Commands.register("formtextarea", {
	requiredArguments: 0,
	concatArgs: true,
	run: function(args, callback) {
		
		var id = _.uniqueId("formtextarea");
		var title = args.length > 0 ? args.shift() : "Type something:";
		var text = args.length > 0 ? args.join(" ") : '';
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<textarea id="' + id + '_area" class="clear">' + text + '</textarea>\
				<small class="form-hint">Ctrl+Enter = OK, Esc = CANCEL</small>\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var textarea = document.getElementById(id + '_area');
		var onKeyDown = function(e) {
			if(e.ctrlKey && e.keyCode === 13) {
				button.click();
			} else if(e.keyCode == 27) {
				buttonCancel.click();
			}
		}

		textarea.focus();
		button.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			var value = textarea.value.replace(/ && /g, '\n');
			callback(value);
			textarea.removeEventListener("keydown", onKeyDown);
			App.commandInputFocus();
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});
		textarea.addEventListener("keydown", onKeyDown);

	},
	man: {
		desc: 'Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form.',
		format: 'formtextarea<br />formtextarea [title]<br />formtextarea [title] [text]',
		examples: [
			{text: 'Command line', code: 'formtextarea "Please type your bio." "Sample text" && echo'},
			{text: 'In script', code: 'formtextarea(\'"Please type your bio."\', \'"Sample text"\', function(bio) {\n\
	console.log(bio);\n\
});'}
		],
		returns: 'string',
		group: 'forms'
	}	
})
Commands.register("tetris", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.removeFocus();
		var self = this;
		var defaultLevel = args.length > 0 ? parseInt(args.shift()) : 1;
		if(!App.global.TetrisStarted) {
			App.global.TetrisStarted = true;
		} else {
			exec("warning Only one tetris game could be started at a time. Use the <i>clear</i> command to remove the previous one.");
			callback();
			return;
		}
		if(!App.global.TetrisInitialized) {
			App.global.TetrisInitialized = true;
			this.injectFiles(["css/Tetris.css", "js/vendor/Tetris.js"], function() {
				self.initTetris(callback, defaultLevel);
			});
		} else {
			this.initTetris(callback, defaultLevel);
		}
	},
	injectFiles: function(files, callback) {
		var filesLoaded = 0;
		var parent = document.querySelector("body") || document.querySelector("head");
		var onFileLoaded = function() {
			if(++filesLoaded == files.length) {
				callback();
			}
		}
		for(var i=0; i<files.length; i++) {
			var file = files[i];
			var parts = file.split(".");
			var ext = parts[parts.length-1].toLowerCase();
			switch(ext) {
				case "js":
					var script = document.createElement('script');
					script.setAttribute("type", "text/javascript");
					script.onload = function() {
						onFileLoaded();
					}
					parent.appendChild(script);
					script.setAttribute("src", file);
				break;
				case "css":
					var css = document.createElement('link');
					css.setAttribute("rel", "stylesheet");
					css.setAttribute("type", "text/css");
					css.onload = function() {
						onFileLoaded();
					}
					parent.appendChild(css);
					css.setAttribute("href", file);
				break;
			}
		}
	},
	initTetris: function(callback, defaultLevel) {
		App.setOutputPanelContent('\
			<div class="regular tetris-holder">\
			<div id="tetris">\
			    <div class="left">\
			        <h1><a href="http://gosu.pl/dhtml/JsTetris.html">JsTetris 1.0.0</a></h1>\
			        <div class="menu">\
			            <div><input type="button" value="New Game" id="tetris-menu-start" /></div>\
			            <div><input type="button" value="Reset" id="tetris-menu-reset" style="display: none"/></div>\
			            <div><input type="button" value="Help" id="tetris-menu-help" /></div>\
			            <!--<div><input type="button" value="Highscores" id="tetris-menu-highscores" /></div>-->\
			        </div>\
			        <div class="keyboard">\
			            <div class="up"><input type="button" value="^" id="tetris-keyboard-up" /></div>\
			            <div class="down"><input type="button" value="v" id="tetris-keyboard-down" /></div>\
			            <div class="left"><input type="button" value="&lt;" id="tetris-keyboard-left" /></div>\
			            <div class="right"><input type="button" value="&gt;" id="tetris-keyboard-right" /></div>\
			        </div>\
			        <div id="tetris-nextpuzzle"></div>\
			        <div id="tetris-gameover">Game Over</div>\
			        <div class="stats">\
		                Level:\
						<span id="tetris-stats-level">1</span><br />\
						Score:\
						<span id="tetris-stats-score">0</span><br />\
						Lines:\
						<span id="tetris-stats-lines">0</span><br />\
						APM:\
						<span id="tetris-stats-apm">0</span><br />\
						Time:\
						<span id="tetris-stats-time">0</span>\
			        </div>\
			    </div>\
			    <div id="tetris-area"></div>\
			    <div id="tetris-help" class="window">\
			        <div class="top">\
			            Help <span id="tetris-help-close" class="close">x</span>\
			        </div>\
			        <div class="content">\
			            <b>Controllers:</b> <br />\
			            up - rotate <br />\
			            down - move down <br />\
			            left - move left <br />\
			            right - move right <br />\
			            space - fall to the bottom <br />\
			            n - new game <br />\
			            <!--r - reset <br />-->\
			            <br />\
			            <b>Rules:</b> <br />\
			            1) Puzzle speed = 80+700/level miliseconds, the smaller value the faster puzzle falls <br />\
			            2) If puzzles created in current level >= 10+level*2 then increase level <br />\
			            3) After puzzle falling score is increased by 1000*level*linesRemoved <br />\
			            4) Each "down" action increases score by 5+level (pressing space counts as multiple down actions)\
			        </div>\
			    </div>\
			    <br class="clear" />\
			</div>\
			</div>\
		');
		var tetris = new Tetris(defaultLevel);
	    tetris.unit = 14;
	    tetris.areaX = 12;
	    tetris.areaY = 22;
	    tetris.start();

	    var tetrisHolderDOMElement = document.querySelector(".tetris-holder");
	    tetrisHolderDOMElement.addEventListener("DOMNodeRemoved", function(e) {
	    	if(e.target === tetrisHolderDOMElement) {
	    		App.global.TetrisStarted = false;
	    		tetris.stop();
	    	}
	    });

		callback();
	},
	man: {
		desc: 'Tetris game.',
		format: 'tetris<br />tetris [level to start from]',
		examples: [
			{text: 'Command line', code: 'tetris'}
		],
		returns: 'null',
		group: 'games'
	}	
});
Commands.register("echo", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'echo [text]',
		examples: [
			{text: 'Command line', code: 'echo Hello world!'},
			{text: 'In script', code: 'echo("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("echoraw", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args, true, true, true) + '</div>');
		callback(this.formatter(args, true, true, true));
	},
	man: {
		desc: 'Outputs message in raw format. Even the html is shown as string.',
		format: 'echoraw [text]',
		examples: [
			{text: 'Command line', code: 'echoraw Hello world!'},
			{text: 'In script', code: 'echoraw("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})
Commands.register("echoshell", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular-shell">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'echoshell [text]',
		examples: [
			{text: 'Command line', code: 'echoshell Hello world!'},
			{text: 'In script', code: 'echoshell("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("error", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'error [text]',
		examples: [
			{text: 'Command line', code: 'error Hello world!'},
			{text: 'In script', code: 'error("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("hidden", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="hidden">' + args.join(" ") + '</div>');
		callback(args.join(" "));
	},
	man: {
		desc: 'Outputs invisible content. I.e. useful when you have to add hidden html markup.',
		format: 'hidden [text]',
		examples: [
			{text: 'Command line', code: 'hidden &lt;input type="hidden" name="property" />'},
			{text: 'In script', code: 'hidden("&lt;input type="hidden" name="property" />", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("hr", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><hr /></div>');
		callback();
	},
	man: function() {
		return 'Adds &lt;hr /> tag to the console\'s output panel';
	},
	man: {
		desc: 'Adds &lt;hr /> tag to the console\'s output panel',
		format: 'hr',
		examples: [
			{text: 'Command line', code: 'hr'},
			{text: 'In script', code: 'hr();'}
		],
		returns: 'null',
		group: 'messages'
	}	
})
Commands.register("info", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'info [text]',
		examples: [
			{text: 'Command line', code: 'info Hello world!'},
			{text: 'In script', code: 'info("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("small", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'small [text]',
		examples: [
			{text: 'Command line', code: 'small Hello world!'},
			{text: 'In script', code: 'small("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})
Commands.register("success", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'success [text]',
		examples: [
			{text: 'Command line', code: 'success Hello world!'},
			{text: 'In script', code: 'success("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("title", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><h1>' + this.formatter(args) + '</h1></div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'title [text]',
		examples: [
			{text: 'Command line', code: 'title Hello world!'},
			{text: 'In script', code: 'title("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}	
})
Commands.register("warning", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: {
		desc: 'Outputs message.',
		format: 'warning [text]',
		examples: [
			{text: 'Command line', code: 'warning Hello world!'},
			{text: 'In script', code: 'warning("Hello world!", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'messages'
	}		
})
var CurrentBlockDirectory = null;
Commands.register("block", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var operation = args.shift();
		if(operation === "start") {
			exec("cwd", function(dir) {
				CurrentBlockDirectory = dir;
				callback();
			})
		} else if(operation === "end") {
			if(CurrentBlockDirectory) {
				exec("cd " + CurrentBlockDirectory, function() {
					callback();
				})
			} else {
				exec("error block already ended.");
				callback();
			}
		} else {
			exec("error <b>block</b> accepts only <i>start</i> and <i>end</i> operations. <i>" + operation + "</i> given.");
			callback();
		}
	},
	man: {
		desc: 'Sometimes you need to execute a series of commands, but you want to keep the context, i.e. the current directory.',
		format: 'block [operation]',
		examples: [
			{text: 'Command line', code: 'block start && cd ../../ && echo Do some stuff here && block end'},
			{text: 'In script', code: 'block("start", function() {\n\
	shell("cd ../../", function() {\n\
		block("end");\n\
	});\n\
});'}
		],
		returns: 'null',
		group: 'os'
	}	
})
Commands.register("cd", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.join(" ");
		shell("cd " + path, callback)
	},
	man: {
		desc: 'Change the current directory',
		format: 'cd [path]',
		examples: [
			{text: 'Command line', code: 'cd D:/Work'},
			{text: 'In script', code: 'cd("D:/Work", function() {\n\
	console.log("directory changed");\n\
});'}
		],
		returns: 'null',
		group: 'os'
	}	
})
Commands.register("cwd", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		callback(Context.get());
	},
	man: {
		desc: 'Returns the current working directory of auxilio-backend.',
		format: 'cwd',
		examples: [
			{text: 'Command line', code: 'cwd'},
			{text: 'In script', code: 'cwd(function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
Commands.register("readfile", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var file = args.shift();
		if(Shell.connected() && Shell.socket()) {
			var id = _.uniqueId("shellcommand");
			var onFileRead = function(res) {
				if(res.id !== id) return;
				Shell.socket().removeListener("readfile", onFileRead);
				if(res.error) {
					if(typeof res.error === 'object') {
						res.error = JSON.stringify(res.error);
					}
					exec("error " + res.error);
					callback(null);
				} else if(res.content) {
					callback(res.content);
				} else {
					callback(res);
				}
			}
			Shell.socket().on("readfile", onFileRead);
			Shell.socket().emit("readfile", {file: file, id: id});
		} else {
			NoShellError("readfile: no shell");
			callback();
		}
	},
	man: {
		desc: 'Read content of a file.',
		format: 'readfile [file]',
		examples: [
			{text: 'Command line', code: 'readfile ./README.md'},
			{text: 'In script', code: 'readfile("./README.md", function(content) {\n\
	console.log(content);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
Commands.register("run", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	totalFiles: 0,
	totalFilesProcessed: 0,
	run: function(args, callback) {
		
		var _path = args.shift();

		var evalJSCode = function(js, parameter, callback) {
			try {
				eval("var auxilioFunction=" + js);
				if(typeof auxilioFunction !== "undefined") {
					auxilioFunction(parameter, callback);
					return;
				}
			} catch(e) {
				exec("error Error executing<pre>" + js + "</pre>" + e.message + "<pre>" + e.stack + "</pre>");
				if(callback) callback();
			}			
		}
		var execFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				}
				evalJSCode(js, args, callback);
			});
		}
		var registerFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				};
				var fileName = getFileName(path);
				Commands.register(fileName, {
					requiredArguments: 0,
					format: '',
					lookForQuotes: true,
					concatArgs: true,
					run: function(args, callback) {
						evalJSCode(js, args, callback);
					},
					man: {
						desc: fileName,
						format: fileName,
						examples: [
							{text: 'Command line', code: fileName},
							{text: 'Source code', code: content},
						],
						returns: 'unknown',
						group: 'add-ons'
					}	
				});
				Autocomplete.prepareDictionary();
			});	
		}
		var loadFiles = function(callback) {
			var dir = _path;
			var cwd = Context.get();
			var self = this;
			Shell.suppressErrorsOnce(); // suppress the errors if cd to a file
			this.totalFiles = this.totalFilesProcessed = 0;
			App.hideNextCommands(2);
			exec("cd " + dir, function(res) {
				if(res.stderr && res.stderr != '') {
					// tries to import a specific file
					processFile(dir, callback);
				} else {
					exec("tree -1 suppressdislay", function(res) {
						if(res && res.result) {

							// counting files
							var count = function(files) {
								for(var f in files) {
									if(files[f] === "file") {
										self.totalFiles += 1;
									} else {
										count(files[f]);
									}
								}
							}
							count(res.result);

							// processing files
							var parseDir = function(childs, dir) {
								for(var f in childs) {
									if(typeof childs[f] === 'string') {
										processFile(dir + "/" + f, function() {
											self.totalFilesProcessed += 1;
											if(self.totalFilesProcessed === self.totalFiles) {
												callback(self.totalFilesProcessed);
											}
										});
									} else {
										parseDir(childs[f], dir + "/" + f);
									}
								}
							}
							App.hideNextCommands(2);
							exec("cd " + cwd, function() {
								parseDir(res.result, dir);
							});

						}
					});
				}
			});		
		}
		var getFileName = function(path) {
			var fileName = path.replace(/\\/g, '/').split('/').pop().split(".");
			fileName.pop();
			return fileName.join(".");
		}
		var processFile = function(filePath, callback) {
			var fileName = getFileName(filePath);
			if(fileName.indexOf("exec.") === 0) {
				execFile(filePath, callback);
			} else {
				registerFile(filePath, callback);
			}
		}

		loadFiles(callback);

	},
	man: {
		desc: 'Register or execute commands stored in external files. The files should contain valid javascript which is actually a function definition in the following format:<pre>\
function nameOfMyFunction(args) {\n\
...\n\n\
}\
</pre>Normally the content of the file is registered as a command, but if the filename starts with <i>exec.</i> the function is executed immediately. For example:<pre>run ./exec.myscript.js</pre>',
		format: 'run [path]',
		examples: [
			{text: 'Importing directory', code: 'run ./files'},
			{text: 'Importing file', code: 'run ./files/myscript.js'},
			{text: 'In script', code: 'run("./myfiles", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Result of the function.',
		group: 'os'
	}	
})
Commands.register("shell", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var command = args.join(" ");
		if(Shell.connected()) {
			if(command !== '') {
				Shell.send(command, function(res) {
					callback(res);
				});
			} else {
				callback();
			}
		} else {
			if(args.length === 0) {
				Shell.connect();
			} else {
				NoShellError("shell: shell is not connected");
			}
			callback();
		}
	},
	man: {
		desc: 'Executes shell command. Have in mind that once you type something in the console and it doesn\'t match any of the auxilio\'s commands it is send to the shell',
		format: 'shell [command]',
		examples: [
			{text: 'Command line', code: 'shell ls'},
			{text: 'In script', code: 'shell("ls", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var deep = -1;
		var regex = args.length > 0 ? args.shift() : '';
		var suppressdisplay = args.length > 0 ? args.shift() : false;
		regex = typeof regex != 'string' ? '' : regex;
		if(!isNaN(regex)) {
			deep = parseInt(regex);
			regex = '';
		}		
		if(Shell.connected() && Shell.socket()) {
			var onTreeDataReceived = function(res) {
				Shell.socket().removeListener("tree", onTreeDataReceived);
				if(suppressdisplay === false && res.result) {
					self.formatResult(res.result, regex, deep);
				}
				callback(res);
			}
			Shell.socket().on("tree", onTreeDataReceived);
			Shell.socket().emit("tree", {dir: './'});
		} else {
			NoShellError("tree: no shell");
			callback();
		}
	},
	formatResult: function(dirs, regex, deep) {

		var result = '',
			self = this,
			id = _.uniqueId("treeoutput");
			r = regex != '' ? new RegExp(regex, 'gi') : false;

		var formatItem = function(name, item, skipIndenting, path, currentDepth) {
			if(deep > 0 && currentDepth == deep) {
				return '';
			}
			var res = '',
				visible = regex != '' ? (path + '/' + name).match(r) : true;
			res += '<div class="' + (skipIndenting ? 'tree-wrapper' : 'tree-wrapper tree-wrapper-indent') + '">';
			if(typeof item == "object") { // directory
				var subfolders = !self.isEmpty(item);
				res += '\
					<div class="tree-item tree-item-dir' + (visible ? '' : ' tree-item-hidden') + '">\
						<a href="javascript:void(0);" class="goto" data-path="' + path + name + '"><span data-path="' + path + name + '">\
						<i class="icon-folder' + (subfolders ? '-open' : '') + '" data-path="' + path + name + '"></i>\
						' + name + '\
						</span></a>\
					</div>\
				';
				for(var i in item) {
					res += formatItem(i, item[i], false, path + name + "/", currentDepth+1);
				}
			} else {  // file
				var filePath = (Context.get().replace(/\\/g, '/') + '/' + path + name).replace(/\.\//g, '');
				res += '\
					<div class="tree-item tree-item-file' + (visible ? '' : ' tree-item-hidden') + '">\
						<a href="javascript:void(0)" class="goto" data-path="' + filePath + '" data-type="file">\
							<span data-path="' + filePath + '" data-type="file"><i class="icon-right-open"  data-type="file" data-path="' + filePath + '"></i>\
						' + name + '\
						</span></a>\
					</div>\
				';
			}
			res += '</div>';
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], true, './', 0);
		}

		App.setOutputPanelContent('<div class="tree" id="' + id + '">' + result + '</div>');

	},
	isEmpty: function(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }
	    return true;
	},
	man: {
		desc: 'Shows a directory tree.',
		format: 'tree<br />tree [regex]<br />tree [deep]<br />tree [suppressdisplay]',
		examples: [
			{text: 'Command line', code: 'tree'},
			{text: 'Showing files by type', code: 'tree \\\.css'},
			{text: 'Showing only two levels', code: 'tree 2'},
			{text: 'Suppress the output to the console', code: 'tree suppressdisplay'},
			{text: 'In script', code: 'tree(2, function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
var WatchHelper = (function() {

	var _isSocketListenerAttached = false;
	var _callbacks = {};
	var _initCallback = null;

	var callInitCallback = function() {
		if(_initCallback) {
			_initCallback();
		}
	}
	var attachSocketListeners = function() {
		if(!_isSocketListenerAttached) {
			_isSocketListenerAttached = true;
			Shell.socket().on("watch-change", function(res) {
				if(_callbacks[res.auxilioId] && _callbacks[res.auxilioId].length > 0) {
					var line = _callbacks[res.auxilioId].join(" && ");
					if(line != '') {
						exec(_callbacks[res.auxilioId].join(" && "), null, res);
					}
				}
			});
			Shell.socket().on("watch-started", function(res) {
				exec('success Watcher started (<b>' + res.path + '</b>).');
				callInitCallback();
			});
			Shell.socket().on("watch-stopped", function(res) {
				exec('success Watcher stopped (<b>' + res.path + '</b>).');
				callInitCallback();
			});
			Shell.socket().on("watch-list", function(res) {
				var watchers = res.watchers ? res.watchers : [];
				if(watchers.length == 0) {
					exec("info There is no watchers.");
				} else {
					var str = '';
					for(var i=0; w=watchers[i]; i++) {
						str += 'ID: ' + w.id + ', Path: ' + w.path + '<br />';
					}
					exec("info Watchers:<br />" + str);
				}
				callInitCallback();
			});
			Shell.socket().on("watch-stopped-all", function(res) {
				exec('success All watchers are stopped.');
				callInitCallback();
			});
		}
	}
	var init = function(data, callback) {
		if(Shell.connected() && Shell.socket()) {
			attachSocketListeners();
			var auxilioId = _.uniqueId("watch");
			if(data.operation == 'start') {
				_callbacks[auxilioId] = data.watchCallback;
			}
			_initCallback = callback;
			Shell.socket().emit("watch", _.extend({auxilioId: auxilioId}, data));
		} else {
			NoShellError("watch: no shell");
			callback();
		}
	}

	return {
		init: init
	}

})();

Commands.register("watch", {
	requiredArguments: 0,
	format: '<pre></pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var operation = args.length > 0 ? args.shift() : 'list';
		var parameter = args.length > 0 ? args.shift() : '';
		var watchCallback = args.length > 0 ? args.shift() : '';
		if(operation != 'list' && operation != 'start' && operation != 'stop' && operation != 'stopall') {
			exec("error Wrong watch operation. User <i>start</i>, <i>stop</i> or <i>stopall</i>. Type <i>man watch</i> to get more information.")
			callback();
		} else {
			if(watchCallback.indexOf(",") >= 0) {
				watchCallback = watchCallback.replace(/, /g, ',').split(',');
			} else {
				watchCallback = [watchCallback];
			}
			WatchHelper.init({
				operation: operation,
				parameter: parameter,
				watchCallback: watchCallback
			}, callback);
		}
	},
	man: {
		desc: 'Watch directory or file for changes.',
		format: 'watch [operation] [id or path] [callback command]',
		examples: [
			{text: 'Get the current watchers and their ids', code: 'watch'},
			{text: 'Start watching', code: 'watch start ./ echo'},
			{text: 'Start watching and call multiple callbacks', code: 'watch start ./ "jshint, echo"'},
			{text: 'Stop watcher', code: 'watch stop 1'},
			{text: 'Stop all watchers', code: 'watch stopall'},
			{text: 'In script', code: 'watch("start", "./", "echo", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
Commands.register("writefile", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var file = args.shift();
		var content = args.join(" ");
		if(Shell.connected() && Shell.socket()) {
			var onFileSaved = function(res) {
				Shell.socket().removeListener("writefile", onFileSaved);
				if(res.error) {
					exec("error " + res.error);
				} else if(res.content) {
					exec("success <small>" + res.content + "</small>");
				}
				callback();
			}
			Shell.socket().on("writefile", onFileSaved);
			Shell.socket().emit("writefile", {file: file, content: content});
		} else {
			NoShellError("writefile: no shell");
			callback();
		}
	},
	man: {
		desc: 'Write content to a file.',
		format: 'writefile [file] [content]',
		examples: [
			{text: 'Command line', code: 'writefile ./test.txt Sample text here.'},
			{text: 'In script', code: 'writefile("./test.txt", "Sample text here", function(res) {\n\
	console.log("File saved successfully.");\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})
Commands.register("pageclick", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclick", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Clicks an element on the page and returns the result immediately. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pageclick [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageclick "body > .my-link-class"'},
			{text: 'Filter the selected elements', code: 'pageclick "body > .my-link-class" "link label"'},
			{text: 'In script', code: 'pageclick("body > .my-link-class", function(res) {\n\
	console.log("Element clicked.");\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}
})
Commands.register("pageclickw", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageclickw", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Clicks an element on the page and waits till the page is updated. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pageclickw [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageclickw "body > .my-link-class"'},
			{text: 'Filter the selected elements', code: 'pageclickw "body > .my-link-class" "link label"'},
			{text: 'In script', code: 'pageclickw("body > .my-link-class", function() {\n\
	console.log("Element clicked.");\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})
Commands.register("pagecontains", {
	requiredArguments: 2,
	run: function(args, callback) {
		var selector = args.shift();
		var text = args.join(" ");
		exec("pagequery " + selector, function(res) {
			if(res.elements && res.elements > 0) {
				var matching = 0;
				var matchedTags = '';
				var r = new RegExp("(" + text + ")", "gi");
				for(var i=0; i<res.raw.length; i++) {
					if(res.raw[i].match(r)) {
						matching += 1;
						matchedTags += '<pre>' + res.raw[i].replace(/</g, '&lt;').replace(r, '<b class="bordered">$1</b>') + '</pre>';
					}
				}
				if(matching === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector and contains <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else if(matching > 1) {
					exec('success There are ' + matching + ' elements matching <b>"' + selector + '"</b> selector and contains <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else {
					exec('error There are element/s(' + res.elements + ') matching <b>"' + selector + '"</b> but non of them contain <b>"' + text + '"</b> text.');
				}
				callback(true);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector.')
				callback(false);
			}			
		});
	},
	man: {
		desc: 'Checks if there is an element matching the provided selector and containing the provided text.',
		format: 'pagecontains [selector] [text]',
		examples: [
			{text: 'Command line', code: 'pagecontains "body > a" "my link"'},
			{text: 'In script', code: 'pagecontains("body > a", "my link", function(res) {\n\
	console.log(res ? "yes" : "no");\n\
});'}
		],
		returns: 'Boolean (true | false)',
		group: 'page'
	}	
})
Commands.register("pageexpect", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		var command = filter ? "pagequery \"" + selector + "\" " + filter : "pagequery \"" + selector + "\"";
		exec(command, function(res) {
			if(res.elements && res.elements > 0) {
				if(res.elements === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''));
				} else {
					exec('success There are ' + res.elements + ' elements matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''));
				}
				callback(res);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector. ' + (filter ? '(filter: <b>' + filter + '</b>)' : ''))
				callback(res);
			}			
		});
	},
	man: {
		desc: 'Checks if there is an element matching the provided selector. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element',
		format: 'pageexpect [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pageexpect a.my-link-class label'},
			{text: 'In script', code: 'pageexpect("a.my-link-class", "label, function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})
Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre></pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagehighlight", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Highlights element/elements on the page. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pagehighlight [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pagehighlight a'},
			{text: 'In script', code: 'pagehighlight("a", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})
Commands.register("pageinsertcss", {
	requiredArguments: 1,
	format: '<pre></pre>',
	lookForQuotes: false,
	run: function(args, callback) {
		var csscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertcss", csscode: csscode}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Inserts css code in the context of the current page',
		format: 'pageinsertcss [css code]',
		examples: [
			{text: 'Command line', code: 'pageinsertcss body { background: #F00 !important; }'},
			{text: 'In script', code: 'pageinsertcss("body { background: #F00 !important; }", function() {\n\
	console.log("CSS applied.");\n\
});'}
		],
		returns: 'string',
		group: 'page'
	}	
})
Commands.register("pageinsertjs", {
	requiredArguments: 1,
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertjs", jscode: jscode}, function(res) {
				if(res) {
					res = JSON.parse(res);
					if(res.length === 1) res = res[0];
				}
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Executes javascript code in the context of the current page',
		format: 'pageinsertjs [js code]',
		examples: [
			{text: 'Command line', code: 'pageinsertjs "document.querySelector(\'body\').click();"'},
			{text: 'In script', code: 'pageinsertjs("document.querySelector(\'body\').click();", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'page'
	}	
})
Commands.register("pageinsertjsw", {
	requiredArguments: 1,
	lookForQuotes: false,
	run: function(args, callback) {
		var jscode = args.join(" ");
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pageinsertjsw", jscode: jscode}, function(res) {
				if(res) {
					res = JSON.parse(res);
					if(res.length === 1) res = res[0];
				}
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Executes javascript code in the context of the current page and waits till the current page is updated',
		format: 'pageinsertjsw [js code]',
		examples: [
			{text: 'Command line', code: 'pageinsertjsw "document.querySelector(\'body\').click();"'},
			{text: 'In script', code: 'pageinsertjsw("document.querySelector(\'body\').click();", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'page'
	}	
})
Commands.register("pagequery", {
	requiredArguments: 1,
	run: function(args, callback) {
		var selector = args.shift();
		var filter = args.length > 0 ? args.join(" ") : null;		
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "pagequery", selector: selector, filter: filter}, function(res) {
				callback(res);
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Returns the number of matched elements and the elements in raw html string format. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.',
		format: 'pagequery [selector] [filter]',
		examples: [
			{text: 'Command line', code: 'pagequery a "label of the link"'},
			{text: 'In script (checks if there is links on the page)', code: 'pagequery("a", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Object containing the matched elements.',
		group: 'page'
	}	
})
Commands.register("load", {
	requiredArguments: 1,
	format: '<pre></pre>',
	run: function(args, callback) {
		var url = args[0];
		if(url.indexOf("http") == -1) url = "http://" + url;
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "load", url: url}, function() {
				exec("echo " + url + " is loaded");
				callback();
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Loads another page in the current tab.',
		format: 'load [url]',
		examples: [
			{text: 'Command line', code: 'load github.com'},
			{text: 'In script', code: 'load("github.com", function() {\n\
	console.log("new page loaded");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})
Commands.register("newtab", {
	requiredArguments: 0,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			if(args[0]) {
				var url = args.shift();
				var active = args.length > 0 ? args.shift() : "true";
				if(url.indexOf("http") == -1 && url.indexOf("data:image") == -1) {
					url = "http://" + url;
				}
				chrome.runtime.sendMessage({type: "newtab", url: url, active: active}, function() {
					callback();
				});
			}else {
				chrome.runtime.sendMessage({type: "newtab"}, callback);
			}
		} else {
			callback();
		}
	},
	man: {
		desc: 'Creates a new tab.',
		format: 'newtab<br />newtab [url] [active (true | false)]',
		examples: [
			{text: 'Command line', code: 'newtab github.com'},
			{text: 'In script', code: 'newtab("github.com", "false", function() {\n\
	console.log("new tab loaded");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})
Commands.register("refresh", {
	requiredArguments: 0,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "refresh"}, function() {
				exec("echo current tab is refreshed");
				callback();
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Refreshes the current tab\'s page',
		format: 'refresh',
		examples: [
			{text: 'Command line', code: 'refresh'},
			{text: 'In script', code: 'refresh(function() {\n\
	console.log("The current page is refreshed.");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})
Commands.register("screenshot", {
	requiredArguments: 0,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "screenshot"}, function(data) {
				if(data) {
					exec("newtab " + data + " false", function() {
						callback();
					});
				} else {
					exec("error There was a problem creating the screenshot.", callback);
				}
			});
		} else {
			callback();
		}
	},
	man: {
		desc: 'Makes a screenshot of the current tab and loads it in a new tab.',
		format: 'screenshot',
		examples: [
			{text: 'Command line', code: 'screenshot'},
			{text: 'In script', code: 'screenshot(function() {\n\
	console.log("The screenshot is made.");\n\
});'}
		],
		returns: 'null',
		group: 'tabs'
	}	
})