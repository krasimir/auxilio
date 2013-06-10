var Commands = {
	register: function(name, logic) {
		this[name] = logic;
	},
	get: function(name) {
		if(name && name != "" && name != " ") {
			if(this[name]) {
				return _.extend({}, CommandBase, {name: name}, this[name]);
			} else {
				exec("error Missing command <b>" + name + "</b>.");
			}			
		}
		return false;
	}
};