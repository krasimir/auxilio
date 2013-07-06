var Commands = {
	register: function(name, logic) {
		this[name] = logic;
		if(typeof window != 'undefined') {
			(function(name) {
				window[name] = function(args, callback) {
					var argsString = '';
					if(args && args.length > 0) {
						for(var i=0; arg = args[i]; i++) {
							if(typeof arg == 'string') {
								argsString += '"' + arg + '"';
							} else {
								argsString += arg;
							}
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