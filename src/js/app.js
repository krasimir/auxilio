// Available commands
var CommandsDictionary = [];

// The main application logic
var App = {
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
		this.command.focus();
		this.loadProfile();
	},
	prepareDictionary: function() {
		// adding commands from Commands
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
	defineUserEvents:function() {
		var self = this;
		this.command.addEventListener("focus", function() {
			self.command.removeEventListener("keyup")
			self.command.addEventListener("keyup", function(e) {
				self.autocomplete();
			});
			self.command.removeEventListener("keydown")
			self.command.addEventListener("keydown", function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(self["key" + code]) self["key" + code](e);
			});
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
			this.output.insertBefore(str2DOMElement(str), this.output.firstChild);
		}
	},
	disableInput: function() {
		this.command.prop('disabled', true);
	},
	enableInput: function() {
		this.command.prop('disabled', false);
	},
	execute: function(commandStr, callback, lookForQuotes) {

		if(!commandStr || commandStr == "" || commandStr == " ") return;

		var lines = commandStr.split(" & ");
		var commands = [];
		var self = this;
		for(var i=0; i<lines.length; i++) {
			commands.push(lines[i]);
		}

		var processCommand = function(str, resultFromPreviousCommand) {
			var args = CommandParser.parse(str, lookForQuotes);
			var command = args.shift();
			var c = Commands.get(command);
			if(!self.isHiddenCommand(command)) {
				exec("small " + str);
			}
			if(c) {
				if(resultFromPreviousCommand && args.length === 0) {
					args = args.concat([resultFromPreviousCommand]);
				}
				if(c.validate(args)) {
					c.run(args, function(res) {
						getNextCommand(res);
					});
				} else {
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
		this.commandsHistory.push(commandStr);
		this.commandsHistoryIndex = -1;
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
			"storage"
		];
		return _.indexOf(commandsToAvoid, command) >= 0;
	},
	loadProfile: function() {
		exec("storage get profiledata", function(data) {
			if(data.profiledata && data.profiledata !== "") {
				exec(data.profiledata.replace(/&amp;/g, '&').replace(/\n/g, ' & '));
			}
		});
	}
}

// Boot
window.onload = function() {
	App.init();
};

// shortcuts
var exec = function(commandStr, callback, lookForQuotes) {
	App.execute(commandStr, callback, lookForQuotes);
}