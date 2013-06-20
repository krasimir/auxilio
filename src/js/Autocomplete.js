// Available commands
var CommandsDictionary = [];
var FilesDictionary = [];

var Autocomplete = (function() {

	var _el,
		_matches = [],
		_listeners = {},
		_commandPart = [],
		_delimeter = ' ';

	var init = function() {
		_el = document.getElementById("js-suggest");
		prepareDictionary();
	}
	var run = function(commandStr) {

		clear();	
		_matches = [];
		if(typeof commandStr === "undefined" || commandStr == "") return;

		if(!splitCommandStr(commandStr, " ")) {
			splitCommandStr(commandStr, "/")
		}

		if(_matches.length > 0) {
			var suggestionStr = '';
			for(var i=0; i<_matches.length; i++) {
				suggestionStr += _matches[i].toLowerCase();
				suggestionStr += i < _matches.length-1 ? ", " : "";
			}
			_el.value = _commandPart.length > 0 ? _commandPart.join(_delimeter) + _delimeter + suggestionStr : suggestionStr;
		}

	}
	var splitCommandStr = function(commandStr, delimeter) {
		_delimeter = delimeter;
		var parts = commandStr.split(delimeter);
		var areThereAnyMatches = performMatching(parts.pop());
		_commandPart = parts;
		return areThereAnyMatches;
	}
	var performMatching = function(word) {
		if(!word || word == '') return;
		var arr = FilesDictionary && FilesDictionary.length > 0 ? CommandsDictionary.concat(FilesDictionary) : CommandsDictionary;
		for(var i=0; i<arr.length; i++) {
			var suggestion = arr[i];
			try {
				var re = new RegExp("^" + word.toLowerCase().replace(/\./, '\\.') + "(.*)?");
				if(suggestion.toLowerCase().match(re)) {
					_matches.push(suggestion);
				}
			} catch(e) {

			}
		}
		return _matches.length > 0;
	}
	var clear = function() {
		_el.value = "";
	}
	var tab = function() {
		if(_matches.length > 0) {
			dispatch("match", {
				value: _commandPart.length > 0 ? _commandPart.join(_delimeter) + _delimeter + _matches[0] : _matches[0]
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