

// The main application logic
var App = {
	commandsStoreInHistory: 50,
	global: {}, // storage for global variables
	commandsToHide: 0,
	init: function() {
		this.command = document.getElementById("js-command");
		this.output = document.getElementById("js-console-output-content");
		this.body = document.querySelector("body");
		this.commandsHistory = [];
		this.commandsHistoryIndex = -1;
		this.defineUserEvents();
		this.registerAliases();
		this.getCommandsHistory();
		this.command.focus();
	},
	defineUserEvents:function() {
		var self = this;
		var onKeyUp = function(e) {
			Autocomplete.run(self.command.value);
		}
		var onKeyDown = function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if(self["key" + code]) self["key" + code](e);
		}
		this.command.addEventListener("focus", function() {
			self.command.removeEventListener("keyup", onKeyUp)
			self.command.addEventListener("keyup", onKeyUp);
			self.command.removeEventListener("keydown", onKeyDown);
			self.command.addEventListener("keydown", onKeyDown);
		});
		this.command.addEventListener("blur", function(e) {
			self.command.removeEventListener("keyup");
			self.command.removeEventListener("keydown");
		});
		this.body.addEventListener("click", function(e) {
			if(e.target.nodeName === "BODY") {
				self.command.focus();
			}
		});
	},
	key13: function(e) { // enter
		e.preventDefault();
		var commandStr = this.command.value;
		this.addToHistory(commandStr);
		this.execute(commandStr, null);
		this.command.value = "";
		Autocomplete.clear();
		this.commandsHistoryIndex = -1;
	},
	key9: function(e) { // tab
		e.preventDefault();
		Autocomplete.tab();
	},
	key38: function(e) { // up
		e.preventDefault();
		if(this.commandsHistory.length == 0) return;
		if(this.commandsHistoryIndex == -1) this.commandsHistoryIndex = this.commandsHistory.length;
		this.commandsHistoryIndex = this.commandsHistoryIndex - 1 > 0 ? this.commandsHistoryIndex -= 1 : 0;
		this.command.value = this.commandsHistory[this.commandsHistoryIndex];
	},
	key40: function(e) { // down
		e.preventDefault();
		if(this.commandsHistory.length == 0) return;
		if(this.commandsHistoryIndex == -1) this.commandsHistoryIndex = this.commandsHistory.length-1;
		this.commandsHistoryIndex = this.commandsHistoryIndex + 1 <= this.commandsHistory.length-1 ? this.commandsHistoryIndex += 1 : this.commandsHistory.length-1;
		this.command.value = this.commandsHistory[this.commandsHistoryIndex];
	},
	clear: function() {
		this.setOutputPanelContent('clear', true);
	},
	setOutputPanelContent: function(str, clearPreviousContent) {
		if(!str || str == "" || str == " ") return;
		var str2DOMElement = function(html) {
			var frame = document.createElement('iframe');
			frame.style.display = 'none';
			document.body.appendChild(frame);			  
			frame.contentDocument.open();
			frame.contentDocument.write(html);
			frame.contentDocument.close();
			var el = frame.contentDocument.body.firstChild;
			document.body.removeChild(frame);
			return el;
		}
		if(clearPreviousContent) {
			this.output.innerHTML = '';
		} else {
			var newElement = str2DOMElement(str);
			newElement.className = newElement.className + " item";
			this.output.insertBefore(newElement, this.output.firstChild);
			setTimeout(function() {
				newElement.className = newElement.className + " item-shown";
			}, 100);			
		}
	},
	disableInput: function() {
		this.command.setAttribute('disabled', true);
	},
	enableInput: function() {
		this.command.setAttribute('disabled', false);
	},
	removeFocus: function() {
		this.command.blur();
	},
	setFocus: function() {
		this.command.focus();
	},
	setCommandValue: function(v) {
		this.command.value = v;
	},
	getCommandValue: function() {
		return this.command.value;
	},
	execute: function(commandStr, callback, arg) {

		if(!commandStr || commandStr == "" || commandStr == " ") return;

		commandStr = ApplyVariables(commandStr);

		var lines = commandStr.split(" && ");
		var commands = [];
		var self = this;
		for(var i=0; i<lines.length; i++) {
			commands.push(lines[i]);
		}

		var processCommand = function(str, resultFromPreviousCommand) {
			str = ApplyVariables(str);
			var command = CommandParser.getCommandName(str);
			var c = Commands.get(command);
			if(c) {

				// outputing the command
				if(!self.isHiddenCommand(command)) {
					var linkId = _.uniqueId("commandlink");
					if(self.commandsToHide === 0) {
						exec("small <a href='#' id='" + linkId + "'>" + str + "</a>");
					} else {
						self.commandsToHide -= 1;
					}
					(function(command, linkId){
						var commandElement = document.querySelector("#" + linkId);
						if(commandElement) {
							document.querySelector("#" + linkId).addEventListener("click", function() {
								exec(command);
							});
						}
					})(str, linkId);
				}

				// adds the result from the previous command
				var args = CommandParser.parse(str, c.lookForQuotes);
				args.shift(); // removing command name
				if(resultFromPreviousCommand && (args.length === 0 || c.concatArgs)) {
					args = args.concat([resultFromPreviousCommand]);
				}

				// validate and execute
				if(c.validate(args)) {
					c.run(args, function(res) {
						getNextCommand(res);
					});
				} else {
					getNextCommand();
				}
				
			} else {

				// sending the command to the shell
				exec("shell " + str, function(res) {
					getNextCommand(res);
				});
				
			}
		}
		var getNextCommand = function(res) {
			if(commands.length == 0) {
				callback ? callback(res) : null;
			} else {
				processCommand(commands.shift(), res);
			}
		}

		getNextCommand(arg);

	},
	addToHistory: function(commandStr) {
		if(this.commandsHistory.length > this.commandsStoreInHistory) {
			this.commandsHistory.shift();
		}
		this.commandsHistory.push(commandStr);
		exec("storage put auxiliohistory " + JSON.stringify(this.commandsHistory).replace(/ && /g, '\n'));
	},
	isHiddenCommand: function(command) {
		var commandsToAvoid = [
			"echo",
			"echoraw",
			"echoshell", 
			"info", 
			"error", 
			"success", 
			"warning", 
			"hidden", 
			"small", 
			"formtextarea", 
			"formconfirm", 
			"forminput", 
			"formfile",
			"echocommand",
			"storage",
			"pagequery",
			"title",
			"newtab",
			"hr",
			"jshint",
			"readfile",
			"writefile",
			"profile",
			"tree",
			"run"
		];
		return _.indexOf(commandsToAvoid, command) >= 0;
	},
	registerAliases: function() {
		var self = this;
		exec("storage get aliases", function(data) {
			if(data.aliases && data.aliases != "") {
				var aliases = JSON.parse(data.aliases);
				for(var i in aliases) {
					(function(name, commands) {
						Commands.register(name, {
							requiredArguments: 0,
							format: '',
							lookForQuotes: true,
							concatArgs: true,
							run: function(args, callback) {
								var commandToCall = commands.replace(/\n/g, ' && ');
								if(args.length > 0) {
									for(var j=0; j<args.length; j++) {
										var r = new RegExp("\\$" + (j + 1), "g");
										commandToCall = commandToCall.replace(r, args[j]);
									}
								}
								exec(commandToCall, callback);
							},
							man: function() {
								return '<pre>' + commands + '</pre>';
							}	
						})
					})(i, aliases[i]);
				}
				Autocomplete.prepareDictionary();
			}
		});
	},
	getCommandsHistory: function() {
		var self = this;
		exec("storage get auxiliohistory", function(data) {
			if(data && data !== '' && data !== null) {
				try {
					data = JSON.parse(data.auxiliohistory.replace(/\n/g, ' && '));
					if(data && data.length) {
						self.commandsHistory = data;
					}					
				} catch(e) {

				}
			}
		});
	},
	commandInputFocus: function() {
		this.command.focus();
	},
	hideNextCommands: function(num) {
		this.commandsToHide = num;
	}
}