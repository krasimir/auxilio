// Available commands
var CommandsDictionary = [];

// The main application logic
var App = {
	init: function() {
		this.suggest = $("#js-suggest");
		this.command = $("#js-command");
		this.output = $("#js-console-output-content");
		this.matches = [];
		this.commandsHistory = [];
		this.commandsHistoryIndex = -1;
		this.defineKeyboardEvents();
		this.prepareDictionary();
		this.command.focus();
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
	defineKeyboardEvents:function() {
		var self = this;
		this.command.on("focus", function() {
			self.command.off("keyup").on("keyup", function(e) {
				self.autocomplete();
			});
			self.command.off("keydown").on("keydown", function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(self["key" + code]) self["key" + code](e);
			});
		});
		this.command.on("blur", function(e) {
			self.command.off("keyup");
			self.command.off("keydown");
		});
	},
	// keyboard handlers
	autocomplete: function() {
		this.suggest.val("");
		this.matches = [];
		var commandStr = this.command.val();
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
			this.suggest.val(suggestionStr);
		}
	},
	key13: function(e) { // enter
		e.preventDefault();
		var commandStr = this.command.val();
		this.addToHistory(commandStr);
		this.execute(commandStr);
		this.command.val("");
		this.suggest.val("");
	},
	key9: function(e) { // tab
		e.preventDefault();
		if(this.matches.length > 0) {
			this.command.val(this.matches[0]);
			this.autocomplete();
		}
	},
	key38: function(e) { // up
		e.preventDefault();
		if(this.commandsHistory.length == 0) return;
		if(this.commandsHistoryIndex == -1) this.commandsHistoryIndex = this.commandsHistory.length;
		this.commandsHistoryIndex = this.commandsHistoryIndex - 1 > 0 ? this.commandsHistoryIndex -= 1 : 0;
		this.command.val(this.commandsHistory[this.commandsHistoryIndex]);
	},
	key40: function(e) { // down
		e.preventDefault();
		if(this.commandsHistory.length == 0) return;
		if(this.commandsHistoryIndex == -1) this.commandsHistoryIndex = this.commandsHistory.length-1;
		this.commandsHistoryIndex = this.commandsHistoryIndex + 1 <= this.commandsHistory.length-1 ? this.commandsHistoryIndex += 1 : this.commandsHistory.length-1;
		this.command.val(this.commandsHistory[this.commandsHistoryIndex]);
	},
	clear: function(str, clearPreviousContent) {
		this.setOutputPanelContent('', true);
	},
	setOutputPanelContent: function(str, clearPreviousContent) {
		var previousContent = this.output.html();
		this.output.html(clearPreviousContent ? str : str + previousContent);
	},
	disableInput: function() {
		this.command.prop('disabled', true);
	},
	enableInput: function() {
		this.command.prop('disabled', false);
	},
	execute: function(commandStr, callback) {

		var lines = commandStr.split(" & ");
		var commands = [];
		var self = this;
		for(var i=0; i<lines.length; i++) {
			commands.push(lines[i]);
		}

		var processCommand = function(str) {
			var args = str.split(" ");
			var command = args.shift();
			var c = Commands[command];
			!self.isMessageCommand(command) ? self.execute("small " + str) : null;
			if(c) {
				if(c.validate(args)) {
					Commands[command].run(args, function() {
						getNextCommand();
					});
				} else {
					getNextCommand();
				}
			} else if(command != "" && command != " ") {
				self.execute("error Missing command <b>" + command + "</b>.");
				getNextCommand();
			}
		}
		var getNextCommand = function() {
			if(commands.length == 0) {
				callback ? callback() : null;
			} else {
				processCommand(commands.shift());
			}
		}
		getNextCommand();

	},
	addToHistory: function(commandStr) {
		var args = commandStr.split(" ");
		var command = args.shift();
		if(!this.isMessageCommand(command)) {
			this.commandsHistory.push(commandStr);
			this.commandsHistoryIndex = -1;
		}
	},
	isMessageCommand: function(command) {
		var commandsToAvoid = ["echo", "info", "error", "success", "warning", "hidden", "small"];
		return _.indexOf(commandsToAvoid, command) >= 0;
	}
}

// Boot
$(document).ready(function() {
	App.init();
});

var exec = function(commandStr, callback) {
	App.execute(commandStr, callback);
}