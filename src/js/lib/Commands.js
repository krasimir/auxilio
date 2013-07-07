var Commands = {
	register: function(name, logic) {
		this[name] = logic;
		if(typeof window != 'undefined') {
			(function(name) {
				window[name] = function() {
					var args = [],
						callback = function() {};
					for(var i=0; argument = arguments[i]; i++) {
						if(i == arguments.length-1 && typeof argument === 'function') {
							callback = argument;
						} else {
							args.push(argument);
						}
					}
					var argsString = '';
					if(args && args.length > 0) {
						for(var i=0; arg = args[i]; i++) {
							argsString += arg;
							if(i < args.length-1) {
								argsString += ' ';
							}
						}
					}
					exec(name + " " + argsString, callback);
				}
			})(name);
		}
	},
	get: function(name) {
		if(name && name != "" && name != " " && this[name]) {
			return _.extend({}, CommandBase, {name: name}, this[name]);
		} else {
			return false;
		}
	}
};