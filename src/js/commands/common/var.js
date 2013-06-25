var VarStorage = {};
var ApplyVariables = function(str) {
	for(var name in VarStorage) {
		var r = new RegExp("\\$\\$" + name, 'g');
		str = str.replace(r, VarStorage[name]);
	}
	return str;
}
Commands.register("var", {
	requiredArguments: 0,
	format: '<pre>var [name] [value]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var name = args.length > 0 ? args.shift() : false;
		var value = args.length > 0 ? args.join(' ') : false;
		if(name === false) {
			for(var name in VarStorage) {
				exec("echo " + name + ": <pre>" + VarStorage[name] + "</pre>");
			}
			callback();
			return;
		} else if(value === false) {
			if(VarStorage[name]) {
				value = VarStorage[name];
			} else {
				exec("error There is no variable with name <i>" + name + "</i>.");
			}
		} else {
			VarStorage[name] = value;
			Autocomplete.prepareDictionary();
		}
		callback(value);
	},
	man: function() {
		return 'Define a variable.<br />Example:\
		<br />var n 10\
		<br />echo $$n is a great position';
	}	
})