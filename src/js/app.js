// Available commands
var Commands = {

}
var CommandsDictionary = ["lose-yourself", "ls", "log", "love-chrome"];

// The main application logic
var App = {
	init: function() {
		this.suggest = $("#js-suggest");
		this.command = $("#js-command");
		this.matches = [];
		this.defineKeyboardEvents();
	},
	defineKeyboardEvents:function() {
		var self = this;
		this.command.on("focus", function() {
			self.command.on("keyup", function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(self["key" + code]) {
					self["key" + code]();
				}
				self.autocomplete();
			});
		});
		this.command.on("blur", function() {
			self.command.off("keydown");
		});
	},
	// keyboard handlers
	autocomplete: function() {
		this.suggest.val("");
		var commandStr = this.command.val();
		if(commandStr == "") return;
		this.matches = [];
		for(var i=0; i<CommandsDictionary.length; i++) {
			var suggestion = CommandsDictionary[i];
			var re = new RegExp("^" + commandStr.toLowerCase() + ".*?");
			if(suggestion.toLowerCase().match(re)) {
				this.matches.push(suggestion);
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
	key13: function() {
		var commandStr = this.command.val();
		this.command.val("");
	}
}

// Boot
$(document).ready(function() {
	App.init();
});