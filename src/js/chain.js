var Chain = function() {

	var _listeners = {},
		_resultOfPreviousFunc = null,
		_self = this,
		_api = {},
		_funcs = [],
		_errors = [];

	var on = function(type, listener) {
		if(!_listeners[type]) _listeners[type] = [];
		_listeners[type].push(listener);
		return _api;
	}
	var off = function(type, listener) {
		if(_listeners[type]) {
			var arr = [];
			for(var i=0; f=_listeners[type][i]; i++) {
				if(f !== listener) {
					arr.push(f);
				}
			}
			_listeners[type] = arr;
		}
		return _api;
	}
	var dispatch = function(type, param) {
		if(_listeners[type]) {
			for(var i=0; f=_listeners[type][i]; i++) {
				f(param, _api);
			}
		}
	}
	var run = function() {
		if(arguments.length > 0) {
			_funcs = [];
			for(var i=0; f=arguments[i]; i++) _funcs.push(f);
			var element = _funcs.shift();
			if(typeof element === 'function') {
				element(_resultOfPreviousFunc, _api);
			} else if(typeof element === 'object' && element.length > 0) {
				var f = element.shift();
				f.apply(f, element.concat([_api.next]));
			}
			
		} else {
			dispatch("done", _resultOfPreviousFunc);
		}
		return _api;
	}
	var next = function(res) {
		_resultOfPreviousFunc = res;
		run.apply(_self, _funcs);
	}
	var error = function(err) {
		if(typeof err != 'undefined') {
			_errors.push(err);
			return _api;
		} else {
			return _errors;
		}		
	}
	var process = function() {
		if(arguments.length > 0) {
			// on method
			if(arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
				on.apply(self, arguments);
			// run method
			} else {
				run.apply(self, arguments);
			}
		}
		return process;
	}

	_api = {
		on: on,
		off: off,
		next: next,
		error: error
	}
	
	return process;

};