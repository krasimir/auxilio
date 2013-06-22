var Commands = {
	register: function(name, logic) {
		this[name] = logic;
	},
	get: function(name) {
		if(name && name != "" && name != " " && this[name]) {
			return _.extend({}, CommandBase, {name: name}, this[name]);
		} else {
			return false;
		}
	}
};