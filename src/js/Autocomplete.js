// Available commands
var CommandsDictionary = [];

var Autocomplete = (function() {

	var _el,
		_matches = [],
		_listeners = {},
		_commandPart = [];

	var init = function() {
		_el = document.getElementById("js-suggest");
		prepareDictionary();
	}
	var run = function(commandStr) {

		clear();
		_matches = [];
		if(typeof commandStr === "undefined" || commandStr == "") return;

		var parts = commandStr.split(" ");
		performMatching(parts.pop());
		_commandPart = parts;

		if(_matches.length > 0) {
			var suggestionStr = '';
			for(var i=0; i<_matches.length; i++) {
				suggestionStr += _matches[i];
				suggestionStr += i < _matches.length-1 ? ", " : "";
			}
			_el.value = _commandPart.length > 0 ? _commandPart.join(" ") + " " + suggestionStr : suggestionStr;
		}

	}
	var performMatching = function(word) {
		if(!word || word == '') return;
		for(var i=0; i<CommandsDictionary.length; i++) {
			var suggestion = CommandsDictionary[i];
			try {
				var re = new RegExp("^" + word.toLowerCase() + "(.*)?");
				if(suggestion.toLowerCase().match(re)) {
					_matches.push(suggestion);
				}
			} catch(e) {

			}
		}
	}
	var clear = function() {
		_el.value = "";
	}
	var tab = function() {
		if(_matches.length > 0) {
			dispatch("match", {
				value: _commandPart.length > 0 ? _commandPart.join(" ") + " " + _matches[0] : _matches[0]
			});
			run();
		}
	}
	var prepareDictionary = function() {
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
	}
	var on = function(type, callback) {
		if(!_listeners[type]) _listeners[type] = [];
		_listeners[type].push(callback);
	}
	var dispatch = function(type, data) {
		if(_listeners[type]) {
			for(var i=0; i<_listeners[type].length; i++) {
				_listeners[type][i](data);
			}
		}
	}

	return {
		init: init,
		run: run,
		clear: clear,
		tab: tab,
		on: on,
		prepareDictionary: prepareDictionary
	}

})();