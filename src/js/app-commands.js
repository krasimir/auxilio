Commands.register("clear", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: function() {
		return 'Clearing the current console\'s output.';
	}	
})
Commands.register("compare", {
	requiredArguments: 4,
	format: '<pre>compare [title] [value1] [expression] [value2]</pre>',
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
	man: function() {
		return 'Compares values. (Have in mind that it works with strings and numbers.)';
	}	
})
Commands.register("date", {
	requiredArguments: 0,
	format: '<pre>date [as object (true | false)]</pre>',
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
	man: function() {
		return 'Gets the current date.';
	}	
})
Commands.register("delay", {
	requiredArguments: 1,
	format: '<pre>delay [miliseconds]</pre>',
	run: function(args, callback) {
		var interval = parseInt(args.shift());
		setTimeout(function() {
			callback();
		}, interval)
	},
	man: function() {
		return 'Delay the next command. For example<br />\
		echo A &amp;&amp; delay 2000 &amp;&amp; echo B\
		';
	}	
})
Commands.register("diff", {
	requiredArguments: 0,
	format: '<pre>diff\ndiff [string1] [string2]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		if(args.length === 0) {
			var self = this;
			exec("inject raw", function(res) {
				if(!res) {
					callback();
					return;
				}
				if(res.length === 2) {
					var file1Ext = self.getExt(res[0].file.name);
					var file2Ext = self.getExt(res[1].file.name);
					if(file1Ext === file2Ext && file1Ext === "json") {
						var file1JSON, file2JSON;
						try {
							file1JSON = JSON.parse(res[0].content);
						} catch(e) {
							exec("error File " + res[0].file.name + " contains invalid json.");
							callback();
							return;
						}
						try {
							file2JSON = JSON.parse(res[1].content);
						} catch(e) {
							exec("error File " + res[1].file.name + " contains invalid json.");
							callback();
							return;
						}
						console.log(file1JSON, file2JSON);
						self.compareJSON(file1JSON, file2JSON, callback);
					} else {
						self.compareText(res[0].content, res[1].content, callback);
					}
				} else {
					exec("error <i>diff</i> works with two files.");
				}
			});
		} else if(args.length === 2) {
			this.compareText(args.shift(), args.shift(), callback);
		} else if(args.length > 0) {
			exec("error Sorry, but <i>diff</i> requires two or no arguments.")
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
		result += 'Difference:<pre>' + dmp.diff_prettyHtml(d) + '</pre>';
		result += 'Text #1:<pre>' + t1 + '</pre>';
		result += 'Text #2:<pre>' + t2 + '</pre>';
		exec("echo " + result);
		callback(d);
	},
	getExt: function(filename) {
		var parts = filename.split(".");
		return parts[parts.length-1].toLowerCase();
	},
	man: function() {
		return 'Comparison of files or strings.';
	}	
})
Commands.register("exec", {
	requiredArguments: 1,
	format: '<pre>exec [command/s]</pre>',
	run: function(args, callback) {
		exec(args.join(" "), function(res) {
			callback(res);
		});
	},
	man: function() {
		return 'Executes a given command. Accepts commands separated by <i>&&</i>.';
	}	
})
Commands.register("execjs", {
	requiredArguments: 2,
	format: '<pre>execjs [js function] [parameter]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var js = args.shift().replace(/\n/g, '');
		var parameter = args.shift();
		var self = this;
		js = ApplyVariables(js);
		if(js.toString().indexOf("function") === 0) {
			this.evalJSCode(js, parameter, callback);
		} else {
			exec(js, function(res) {
				if(typeof res == 'object') {
					res = res.join(' ');
				}
				self.evalJSCode(res.replace(/ && /g, '\n'), parameter, callback);
			});
		}
	},
	evalJSCode: function(js, parameter, callback) {
		var funcResult = null;
		try {
			eval("var auxilioFunction=" + js);
			if(typeof auxilioFunction !== "undefined") {
				funcResult = auxilioFunction(parameter);
			}
		} catch(e) {
			exec("error Error executing<pre>" + js + "</pre>" + e.message + "<pre>" + e.stack + "</pre>");
		}
		callback(funcResult);
	},
	man: function() {
		return 'Evals a javascript function. It is very useful to use the command together with others. Like for example:<br />\
		date &amp;&amp; execjs "function fName(date) { exec(\'echo \' + date); }"\
		[js function] could be also a regular command, like <i>inject</i> for example\
		';
	}	
})
Commands.register("execl", {
	requiredArguments: 1,
	format: '<pre>execl</pre>',
	run: function(args, callback) {
		args = args.join(" ").replace(/\n/g, ' && ');
		exec(args, function(res) {
			callback(res);
		});
	},
	man: function() {
		return 'Executes a given command/s. Accepts commands separated by new line.';
	}	
})
Commands.register("history", {
	requiredArguments: 0,
	format: '<pre>history</pre>',
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
		exec('info ' + message, callback, true);
	},
	man: function() {
		return 'Outputs the current console\'s history.';
	}	
})
Commands.register("inject", {
	requiredArguments: 0,
	format: '<pre>inject [type]</pre>',
	processing: false,
	files: null,
	filesRaw: null,
	proccessedFiles: -1,
	commands: [],
	callback: null,
	type: 'auxilio',
	run: function(args, callback) {
		this.type = args.length > 0 ? args.shift() : 'auxilio';
		this.callback = callback;
		if(this.processing) {
			exec("error Sorry but <b>inject</b> command is working right now. Try again later.");
			this.callback();
			return;
		}
		this.reset();
		var id = _.uniqueId("files");
		var self = this;
		var input = 'Choose a file(s): <input type="file" id="' + id + '" name="files[]" multiple />';
		exec('echo ' + input);
		this.inputElement = document.getElementById(id);
		this.inputElement.addEventListener('change', function(e) {
			self.processing = true;
			self.handleFileSelected(e);
		}, false);
		this.inputElement.focus();
		this.inputElement.click();
	},
	handleFileSelected: function(e) {
		this.files = e.target.files;
		var message = '<b>Selected file(s):</b><br />';
		var self = this;
		for(var i=0, f; f=this.files[i]; i++) {
			message += f.name + "<br />";
			var reader = new FileReader();
			(function(reader, f) {
				reader.onload = function(e) {
					if(e.target.result) {
						switch(self.type) {
							case 'raw': self.handleFileReadRaw(f, e.target.result); break;
							default: self.handleFileRead(f, e.target.result); break;
						}						
					}
				};
				reader.readAsText(f);
			})(reader, f);
		}
		exec('echo ' + message);
	},
	handleFileRead: function(file, content) {
		var fileCommands = content.split("\n");
		for(var i=0, c; c = fileCommands[i]; i++) {
			this.commands.push(c.replace(/\n/g, '').replace(/\r/g, ''));
		}
		this.proccessedFiles += 1;
		if(this.proccessedFiles == this.files.length-1) {
			var commandsString = this.commands.join(" && ");
			this.inputElement.style.display = "none";
			App.setFocus();
			this.callback(commandsString);
			this.reset();
		}
	},
	handleFileReadRaw: function(file, content) {
		if(!this.filesRaw) this.filesRaw = [];
		this.filesRaw.push({file: file, content: content});
		this.proccessedFiles += 1;
		if(this.proccessedFiles == this.files.length-1) {			
			this.inputElement.style.display = "none";
			App.setFocus();
			this.callback(this.filesRaw);
			this.reset();
		}
	},
	reset: function() {
		this.processing = false;
		this.files = null;
		this.proccessedFiles = -1;
		this.commands = [];
		this.filesRaw = null;
	},
	man: function() {
		return 'Inject external javascript to be run in the context of Auxilio and current page. By default the command works with <i>type=auxilio</i>.\
		It could be also <i>type=raw</i>. Then instead of string the callback is called with an object containing the files.';
	}	
})
Commands.register("l", {
	run: function(args, callback) {
		App.clear();
		callback();
	},
	man: function() {
		return 'Clearing the current console\'s output.';
	}	
})
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
		if(c) {
			var message = '(<b>' + commandName + '</b>) ' + (c.man ? c.man() : '');
			c.format && c.format != '' ? message += '<br />' + c.format : null;
			exec("echo " + message);
		}
	},
	man: function() {
		return 'Shows information about available commands.';
	}
})
Commands.register("marker", {
	requiredArguments: 0,
	format: '<pre>marker</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "marker"}, callback);
		}
	},
	man: function() {
		return 'Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.';
	}	
})
Commands.register("middleman", {
	requiredArguments: 1,
	format: '<pre>middleman [resource]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {		
		callback(args);
	},
	man: function() {
		return 'The command simply passes the given argument to its callback';
	}	
})
Commands.register("read", {
	requiredArguments: 2,
	format: '<pre>read [path] [json object]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.shift();
		var obj = args.shift();

		if(typeof obj == 'object' && path != '') {

			var parse = function(currentPath, o) {
				console.log(currentPath, o);
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
					if(typeof o[arrName].length !== 'undefined' && o[arrName][index]) {
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
	man: function() {
		return 'Extracts a value from json object. For example:\
		<br />Let\'s say that we have the following <i>object</i> - {data: { users: [10, 11, 12] }}\
		<br /><i>read data.users[1] object</i> will return 11\
		';
	}	
});
Commands.register("request", {
	requiredArguments: 1,
	format: '<pre>request [url]<br />request [url] [raw]</pre>',
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
	man: function() {
		return 'Sends ajax request and shows the result in the console.<br />\
		Use <b>raw</b> parameter to leave the data as it is received from the url. \
		For example:<br />\
		request github.com true';
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
	format: '<pre>stringify [text or object]</pre>',
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
	man: function() {
		return 'Just bypasses the given arguments as string';
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
	man: function() {
		return 'Define a variable.<br />Example:\
		<br />var n 10\
		<br />echo $$n is a great position';
	}	
})
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
Commands.register("profile", {
	requiredArguments: 0,
	format: '<pre>echo [operation]</pre>',
	run: function(args, callback) {
		var operation = args[0] || "show";
		var self = this;
		switch(operation) {
			case "show":
				exec("storage get profiledata", function(data) {
					if(data.profiledata && data.profiledata !== "") {
						var str = 'Your profile:<br />';
						str += '<pre>' + data.profiledata + '</pre>';
						exec('info ' + str, callback);
					} else {
						exec('info There is no profile data.', callback);
					}
				});
			break;
			case "edit":
				exec("storage get profiledata", function(data) {
					var currentValue = '';
					if(data.profiledata && data.profiledata !== "") {
						currentValue = data.profiledata;
					}
					exec('formtextarea "Manage your profile:" ' + currentValue, function(newValue) {
						if(typeof newValue !== "undefined") {
							exec("storage put profiledata " + newValue, function() {
								exec('success Profile changed successfully.', callback);
							});
						} else {
							callback();
						}
					});
				});
			break;
			case "import":
				exec("inject", function(data) {
					data = data.replace(/ && /g, '\n');
					exec("storage put profiledata " + data, function() {
						exec('success Profile changed successfully.', callback);
					});
				});
			break;
			case "clear":
				exec("storage remove profiledata", function() {
					exec('success Profile cleared successfully.', callback);
				});
			break;
			case "run":
				App.loadProfile();
				callback();
			break;
		}
	},
	man: function() {
		return 'Manages your current profile file. Valid operations:<br />show, edit, import, clear, run';
	}	
})
Commands.register("storage", {
	requiredArguments: 1,
	format: '<pre>storage [operation] [key] [value]</pre>',
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
	man: function() {
		return '\
			Store key-value pairs by using chrome.storage.sync API.<br />\
			Examples:<br />\
			storage put username Auxilio // stores username=Auxilio<br />\
			storage get username // returns Auxilio<br />\
			storage remove username // returns Auxilio<br />\
			storage get // returns all stored values<br />\
		';
	}	
})
Commands.register("formconfirm", {
	requiredArguments: 1,
	format: '<pre>formconfirm [question]</pre>',
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
	man: function() {
		return 'Shows a text (question) with two options - YES and NO. The callback accepts only one boolean parameter.';
	}	
})
Commands.register("formfile", {
	requiredArguments: 0,
	format: '<pre>formfile [title]</pre>',
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
	man: function() {
		return 'Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.';
	}	
})
Commands.register("forminput", {
	requiredArguments: 0,
	format: '<pre>forminput [title]\forminput [title] [text]</pre>',
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
	man: function() {
		return 'Shows a simple form with input and button. Use the callback of the command to get the text submitted by the form.';
	}	
})
Commands.register("formtextarea", {
	requiredArguments: 0,
	concatArgs: true,
	format: '<pre>formtextarea [title]\nformtextarea [title] [text]</pre>',
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
	man: function() {
		return 'Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form.';
	}	
})
Commands.register("tetris", {
	requiredArguments: 0,
	format: '<pre>tetris [level to start from]</pre>',
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
	man: function() {
		return 'Tetris game.';
	}	
});
Commands.register("alert", {
	requiredArguments: 1,
	format: '<pre>alert [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {	
		alert(this.formatter(args, false, true));
		callback(this.formatter(args, false, true));
	},
	man: function() {
		return 'Alerts message.';
	}	
})
Commands.register("echo", {
	requiredArguments: 1,
	format: '<pre>echo [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs message.';
	}	
})
Commands.register("echoraw", {
	requiredArguments: 1,
	format: '<pre>echoraw [string]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular">' + this.formatter(args, true, true, true) + '</div>');
		callback(this.formatter(args, true, true, true));
	},
	man: function() {
		return 'Outputs message in raw format. Even the html is shown as string.';
	}	
})
Commands.register("echoshell", {
	requiredArguments: 1,
	format: '<pre>echoshell [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="regular-shell">' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs message.';
	}	
})
Commands.register("error", {
	requiredArguments: 1,
	format: '<pre>error [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="error"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs error message.';
	}	
})
Commands.register("hidden", {
	requiredArguments: 1,
	format: '<pre>hidden [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="hidden">' + args.join(" ") + '</div>');
		callback(args.join(" "));
	},
	man: function() {
		return 'Outputs invisible content. I.e. useful when you have to add hidden html markup.';
	}	
})
Commands.register("hr", {
	requiredArguments: 0,
	format: '<pre>hr</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><hr /></div>');
		callback();
	},
	man: function() {
		return 'Adds &lt;hr /> tag to the console\'s output panel';
	}	
})
Commands.register("info", {
	requiredArguments: 1,
	format: '<pre>info [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="info"><i class="icon-info-circled"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs info message.';
	}	
})
Commands.register("small", {
	requiredArguments: 1,
	format: '<pre>small [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="small"><i class="icon-right-hand"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs small message.';
	}	
})
Commands.register("success", {
	requiredArguments: 1,
	format: '<pre>success [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="success"><i class="icon-ok"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs success message.';
	}	
})
Commands.register("title", {
	requiredArguments: 1,
	format: '<pre>title [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div><h1>' + this.formatter(args) + '</h1></div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs a title.';
	}	
})
Commands.register("warning", {
	requiredArguments: 1,
	format: '<pre>warning [text]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.setOutputPanelContent('<div class="warning"><i class="icon-attention"></i> ' + this.formatter(args) + '</div>');
		callback(this.formatter(args));
	},
	man: function() {
		return 'Outputs warning message.';
	}	
})
Commands.register("shell", {
	requiredArguments: 0,
	format: '<pre>shell [command]</pre>',
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
				NoShellError();
			}
			callback();
		}
	},
	man: function() {
		return 'Executes shell command.';
	}	
})
var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	format: '<pre>tree [regex or deep]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var deep = -1;
		var regex = args.length > 0 ? args.shift() : '';
		regex = typeof regex != 'string' ? '' : regex;
		if(!isNaN(regex)) {
			deep = parseInt(regex);
			regex = '';
		}		
		if(Shell.connected() && Shell.socket()) {
			var onTreeDataReceived = function(res) {
				Shell.socket().removeListener("tree", onTreeDataReceived);
				if(res.result) self.formatResult(res.result, regex, deep);
				callback();
			}
			Shell.socket().on("tree", onTreeDataReceived);
			Shell.socket().emit("tree", {dir: './'});
		} else {
			NoShellError();
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
	man: function() {
		return 'Shows a directory tree.<br />\
		regex - regular expression for filtering the output</i>\
		';
	}	
})
var WatchHelper = (function() {

	var _isSocketListenerAttached = false;
	var _callbacks = {};

	var attachSocketListeners = function() {
		if(!_isSocketListenerAttached) {
			_isSocketListenerAttached = true;
			Shell.socket().on("watch-change", function(res) {
				if(_callbacks[res.auxilioId]) {
					exec(_callbacks[res.auxilioId], null, res);
				}
			});
			Shell.socket().on("watch-started", function(res) {
				exec('success Watcher started (<b>' + res.path + '</b>).');
			});
			Shell.socket().on("watch-stopped", function(res) {
				exec('success Watcher stopped (<b>' + res.path + '</b>).');
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
			});
		}
	}
	var init = function(data, callback) {
		if(Shell.connected() && Shell.socket()) {
			attachSocketListeners();
			var auxilioId = _.uniqueId("watch");
			if(data.operation == 'start' && data.watchCallback != '') {
				_callbacks[auxilioId] = data.watchCallback;
			}
			Shell.socket().emit("watch", _.extend({auxilioId: auxilioId}, data));
		} else {
			NoShellError();
			callback();
		}
	}

	return {
		init: init
	}

})();

Commands.register("watch", {
	requiredArguments: 0,
	format: '<pre>watch [operation] [id or path] [callback command]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var operation = args.length > 0 ? args.shift() : 'list';
		var parameter = args.length > 0 ? args.shift() : '';
		var watchCallback = args.length > 0 ? args.shift() : '';
		if(operation != 'list' && operation != 'start' && operation != 'stop') {
			exec("error Wrong watch operation. User <i>start</i> or <i>stop</i>. Type <i>man watch</i> to get more information.")
			callback();
		} else {
			WatchHelper.init({
				operation: operation,
				parameter: parameter,
				watchCallback: watchCallback
			}, callback);
		}
	},
	man: function() {
		return 'Watch directory or file for changes.\
		<br />Operations:\
		<br />a) watch (without arguments) - shows the current watched file or directory\
		<br />b) watch start [path to file or directory] [callback command] - start watching\
		<br />c) watch stop [id] - stop watching. Use a) to find out the ids\
		';
	}	
})
Commands.register("pageclick", {
	requiredArguments: 1,
	format: '<pre>pageclick [selector] [filter]</pre>',
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
	man: function() {
		return 'Clicks an element on the page and returns the result immediately.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.';
	}
})
Commands.register("pageclickw", {
	requiredArguments: 1,
	format: '<pre>pageclickw [selector] [filter]</pre>',
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
	man: function() {
		return 'Clicks an element on the page and waits till the page is updated (i.e. a new url is fully loaded).<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.';
	}	
})
Commands.register("pagecontains", {
	requiredArguments: 2,
	format: '<pre>pagecontains [selector] [text]</pre>',
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
	man: function() {
		return 'Checks if there is an element matching the provided selector and containing the provided text.<br />\
		Example:<br />\
		pagecontains "body > a" "my link"';
	}	
})
Commands.register("pageexpect", {
	requiredArguments: 1,
	format: '<pre>pageexpect [selector] [filter]</pre>',
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
	man: function() {
		return 'Checks if there is an element matching the provided selector.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element';
	}	
})
Commands.register("pagehighlight", {
	requiredArguments: 1,
	format: '<pre>pagehighlight [selector] [filter]</pre>',
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
	man: function() {
		return 'Highlights element/elements on the page.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.';
	}	
})
Commands.register("pageinsertcss", {
	requiredArguments: 1,
	format: '<pre>pageinsertcss [css code]</pre>',
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
	man: function() {
		return 'Inserts css code in the context of the current page<br />\
		Example:<br />\
		pageinsertcss body { background: #F00; }';
	}	
})
Commands.register("pageinsertjs", {
	requiredArguments: 1,
	format: '<pre>pageinsertjs [js code]</pre>',
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
	man: function() {
		return 'Executes javascript code in the context of the current page<br />\
		Example:<br />\
		pageinsertjs "document.querySelector(\'body\').click();"';
	}	
})
Commands.register("pageinsertjsw", {
	requiredArguments: 1,
	format: '<pre>pageinsertjsw [js code]</pre>',
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
	man: function() {
		return 'Executes javascript code in the context of the current page and waits till the current page is updated<br />\
		Example:<br />\
		pageinsertjsw "document.querySelector(\'form\').submit();"';
	}	
})
Commands.register("pagequery", {
	requiredArguments: 1,
	format: '<pre>pagequery [selector] [filter]</pre>',
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
	man: function() {
		return 'Returns the number of matched elements and the elements in raw html string format.<br />\
		Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.\
		Example: {"elements": 1, "raw": ["&lt;a href=\"#\">test&lt;/a>"]}';
	}	
})
Commands.register("load", {
	requiredArguments: 1,
	format: '<pre>load [url]</pre>',
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
	man: function() {
		return 'Loads another page in the current tab.';
	}	
})
Commands.register("newtab", {
	requiredArguments: 0,
	format: '<pre>newtab\nnewtab [url] [active (true | false)]</pre>',
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
	man: function() {
		return 'Creates a new tab.';
	}	
})
Commands.register("refresh", {
	requiredArguments: 0,
	format: '<pre>refresh</pre>',
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
	man: function() {
		return 'Refreshes the current tab\'s page';
	}	
})
Commands.register("screenshot", {
	requiredArguments: 0,
	format: '<pre>screenshot</pre>',
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
	man: function() {
		return 'Makes a screenshot of the current tab and loads it in a new tab.';
	}	
})