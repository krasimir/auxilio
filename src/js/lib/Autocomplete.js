// Available commands
var CommandsDictionary = [];

var Autocomplete = (function() {

	var _el,
		_matches = [],
		_listeners = {},
		_commandPart = [],
		_delimeter = ' ',
		_hint,
		_filesMode = false, // true if a path should be autocompleted
		_contextFiles = [],
		_filesModeFiles = [],
		isReadDirListenerAdded = false;

	var init = function() {
		_el = document.getElementById("js-suggest");
		_hint = document.getElementById("js-hint");
		prepareDictionary();
	}
	var run = function(commandStr) {

		clear();	
		hideHint();
		_matches = [];
		if(typeof commandStr === "undefined" || commandStr == "") return;

		// requesting directory listing
		var lastCharacter = commandStr.charAt(commandStr.length-1);
		if(lastCharacter === "/") {
			if(Shell.connected()) {
				if(!isReadDirListenerAdded) {
					isReadDirListenerAdded = true;
					Shell.socket().on("readdir", function(res) {
						_filesModeFiles = res.files || [];
						showHint(_filesModeFiles.join('<br />'));
					});
				}
				Shell.socket().emit("readdir", { path: commandStr.split(" ").pop() });
				_filesMode = true;
			} else {
				_filesMode = false;
			}
		} else if(lastCharacter === ' ' || commandStr.indexOf("/") === -1) {
			_filesMode = false;
		}

		splitCommandStr(commandStr, " ") || 
		splitCommandStr(commandStr, "/") ||
		splitCommandStr(commandStr, "$$") ||
		splitCommandStr(commandStr, "\"") ||
		splitCommandStr(commandStr, ",");

		if(_matches.length > 0) {
			var suggestionStr = '';
			for(var i=0; i<_matches.length; i++) {
				suggestionStr += _matches[i];
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
		var arr = [];
		if(!_filesMode) {
			arr = CommandsDictionary.concat(_contextFiles);
		} else {
			arr = _filesModeFiles;
		}
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
		// adding variables
		if(VarStorage) {
			for(var varName in VarStorage) {
				CommandsDictionary.push(varName);
			}
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
	var showHint = function(str) {
		_hint.innerHTML = str == '' ? "." : str;
		_hint.style.left = "10px";
	}
	var hideHint = function() {
		_hint.style.left = "-800px";
	}
	var setContextFiles = function(files) {
		_contextFiles = files || _contextFiles;
	}
	var setFileModeFiles = function(files) {
		_filesModeFiles = files || _filesModeFiles;
	}

	return {
		init: init,
		run: run,
		clear: clear,
		tab: tab,
		on: on,
		prepareDictionary: prepareDictionary,
		showHint: showHint,
		hideHint: hideHint,
		setContextFiles: setContextFiles,
		setFileModeFiles: setFileModeFiles
	}

})();