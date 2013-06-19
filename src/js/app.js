// Available commands
var CommandsDictionary = [];

// The main application logic
var App = {
	commandsStoreInHistory: 50,
	global: {}, // storage for global variables
	init: function() {
		this.suggest = document.getElementById("js-suggest");
		this.command = document.getElementById("js-command");
		this.output = document.getElementById("js-console-output-content");
		this.body = document.querySelector("body");
		this.matches = [];
		this.commandsHistory = [];
		this.commandsHistoryIndex = -1;
		this.defineUserEvents();
		this.prepareDictionary();
		this.loadProfile();
		this.registerAliases();
		this.getCommandsHistory();
		this.command.focus();
	},
	defineUserEvents:function() {
		var self = this;
		var onKeyUp = function(e) {
			self.autocomplete();
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
	prepareDictionary: function() {
		// adding commands from Commands
		CommandsDictionary = [];
		for(var i in Commands) {
			var added = false;
			for(var j=0; j<CommandsDictionary.length; j++) {
				if(CommandsDictionary[j] == i) {
					added = true;
					j = CommandsDictionary.length;
				}
			}
			if(!added) CommandsDictionary.push(i);
		}
		// sort the array by command length
		for(var i=0; i<CommandsDictionary.length; i++) {
			for(var j=0; j<CommandsDictionary.length; j++) {
				if(CommandsDictionary[i].length < CommandsDictionary[j].length) {
					var temp = CommandsDictionary[i];
					CommandsDictionary[i] = CommandsDictionary[j];
					CommandsDictionary[j] = temp;
				}
			}
		}
	},
	// keyboard handlers
	autocomplete: function() {
		this.suggest.value = "";
		this.matches = [];
		var commandStr = this.command.value;
		if(commandStr == "") return;
		for(var i=0; i<CommandsDictionary.length; i++) {
			var suggestion = CommandsDictionary[i];
			try {
				var re = new RegExp("^" + commandStr.toLowerCase() + "(.*)?");
				if(suggestion.toLowerCase().match(re)) {
					this.matches.push(suggestion);
				}
			} catch(e) {

			}
		}
		if(this.matches.length > 0) {
			var suggestionStr = '';
			for(var i=0; i<this.matches.length; i++) {
				suggestionStr += this.matches[i];
				suggestionStr += i < this.matches.length-1 ? ", " : "";
			}
			this.suggest.value = suggestionStr;
		}
	},
	key13: function(e) { // enter
		e.preventDefault();
		var commandStr = this.command.value;
		this.addToHistory(commandStr);
		this.execute(commandStr, null, true);
		this.command.value = "";
		this.suggest.value = "";
		this.commandsHistoryIndex = -1;
	},
	key9: function(e) { // tab
		e.preventDefault();
		if(this.matches.length > 0) {
			this.command.value = this.matches[0];
			this.autocomplete();
		}
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
	execute: function(commandStr, callback) {		

		if(!commandStr || commandStr == "" || commandStr == " ") return;

		var lines = commandStr.split(" && ");
		var commands = [];
		var self = this;
		for(var i=0; i<lines.length; i++) {
			commands.push(lines[i]);
		}

		var processCommand = function(str, resultFromPreviousCommand) {
			var command = CommandParser.getCommandName(str);
			var c = Commands.get(command);
			if(c) {

				// outputing the command
				if(!self.isHiddenCommand(command)) {
					var linkId = _.uniqueId("commandlink");
					exec("small <a href='#' id='" + linkId + "'>" + str + "</a>");
					(function(command, linkId){
						document.querySelector("#" + linkId).addEventListener("click", function() {
							exec(command);
						});
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

				// checking for active socket.io app
				if(Shell.connected()) {
					Shell.send(str, function(res) {
						getNextCommand(res);
					});
				} else {
					exec("error Missing command <b>" + command + "</b>.");
					getNextCommand();
				}
			}
		}
		var getNextCommand = function(res) {
			if(commands.length == 0) {
				callback ? callback(res) : null;
			} else {
				processCommand(commands.shift(), res);
			}
		}

		getNextCommand();

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
			"hr"
		];
		return _.indexOf(commandsToAvoid, command) >= 0;
	},
	loadProfile: function() {
		exec("storage get profiledata", function(data) {
			if(data.profiledata && data.profiledata !== "") {
				exec(data.profiledata.replace(/\n/g, ' && '));
			}
		});
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
							format: '[that\'s an alias]',
							run: function(args, callback) {
								exec(commands.replace(/\n/g, ' && '), callback);
							},
							man: function() {
								return '[that\'s an alias]';
							}	
						})
					})(i, aliases[i]);
				}
				self.prepareDictionary();
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
	}
}