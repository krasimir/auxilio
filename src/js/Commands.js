var CommandBase = {
	name: '',
	requiredArguments: 0,
	format: '',
	run: function(args, callback) {

	},
	man: function() {
		return '<u>' + this.name + '</u> has no manual page.';
	},
	validate: function(args) {
		if(this.requiredArguments === 0 || (args && args.length && args.length >= this.requiredArguments)) { return true; }
		else {
			var message = '<u><b>' + this.name + '</b></u> requires at least ' + this.requiredArguments + ' arguments.';
			this.format != '' ? message += '<br />' + this.format : null;
			App.execute("error " + message);
		}
	}
}
var Commands = {
	register: function(name, logic) {
		this[name] = _.extend({}, CommandBase, {name: name}, logic);
	}
};