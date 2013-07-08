var Chain = (function() {

	var _listeners = {},
		_resultOfPreviousFunc = null,
		self = this,
		api = {};

	var on = function(type, listener) {
		if(!_listeners[type]) _listeners[type] = [];
		_listeners[type].push(listener);
		return api;
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
		return api;
	}
	var dispatch = function(type, param) {
		if(_listeners[type]) {
			for(var i=0; f=_listeners[type][i]; i++) {
				f(param);
			}
		}
	}
	var run = function() {
		if(arguments.length > 0) {
			var funcs = [];
			for(var i=0; f=arguments[i]; i++) funcs.push(f);
			var element = funcs.shift();
			if(typeof element === 'function') {
				element(_resultOfPreviousFunc, function(res) {
					_resultOfPreviousFunc = res;
					run.apply(self, funcs);
				})
			} else if(typeof element === 'object' && element.length > 0) {
				var f = element.shift();
				var callback = function(res) {
					_resultOfPreviousFunc = res;
					run.apply(self, funcs);
				}
				f.apply(f, element.concat([callback]));
			}
			
		} else {
			dispatch("done", _resultOfPreviousFunc);
		}
		return api;
	}

	return api = {
		run: run,
		on: on,
		off: off
	}

})();