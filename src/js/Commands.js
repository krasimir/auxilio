var Commands = {
	register: function(name, logic) {
		this[name] = _.extend({}, CommandBase, {name: name}, logic);
	}
};