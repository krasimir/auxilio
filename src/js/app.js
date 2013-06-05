// Available commands
var CommandsDictionary = ["lose-yourself", "ls", "log", "love-chrome"];

// The main application logic
var App = {
	init: function() {
		this.suggest = $("#js-suggest");
		this.command = $("#js-command");
		this.output = $("#js-console-output-content");
		this.matches = [];
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
			self.command.on("keyup", function(e) {
				self.autocomplete();
			});
			self.command.on("keydown", function(e) {
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
		var commandParts = commandStr.split(" ");
		var command = commandParts.shift();
		if(Commands[command]) {
			Commands[command](commandParts);
		} else {
			this.error("Missing command <strike>" + command + "</strike>.");
		}
		this.command.val("");
	},
	key9: function(e) { // tab
		e.preventDefault();
		if(this.matches.length > 0) {
			this.command.val(this.matches[0]);
			this.autocomplete();
		}
	},
	// console output panel
	clear: function(str, clearPreviousContent) {
		this.echo('', true);
	},
	error: function(str) {
		this.echo('<div class="error"><i class="icon-right-open"></i> ' + str + '</div>');
	},
	echo: function(str, clearPreviousContent) {
		var previousContent = this.output.html();
		this.output.html(clearPreviousContent ? str : previousContent + str);
	},
	disableInput: function() {
		this.command.prop('disabled', true);
	},
	enableInput: function() {
		this.command.prop('disabled', false);
	}
}

// Boot
$(document).ready(function() {
	App.init();
});