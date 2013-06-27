Commands.register("read", {
	requiredArguments: 2,
	format: '<pre>read [path] [json object]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var path = args.shift();
		var obj = args.shift();

		if(typeof obj == 'object' && path != '') {

			var parse = function(currentPath, o) {
				if(currentPath.length === 0) {
					callback(o);
					return;
				}
				var part = currentPath.shift(),
					index = null,
					arrName = null;
				if(part.indexOf("[") >= 0 && part.indexOf("]") > 0) {
					var subParts = part.split('[');
					var arrName = subParts.shift();
					var index = parseInt(subParts.shift().replace(']', ''));
				}
				if(index !== null) {
					if(o[arrName] && typeof o[arrName].length !== 'undefined' && o[arrName][index]) {
						parse(currentPath, o[arrName][index]);
					} else {
						exec('error read: wrong path (error working with arrays)');
					}
				} else {
					if(o[part]) {
						parse(currentPath, o[part]);
					} else {
						exec('error read: wrong path');
						callback();
					}
				}
			}

			parse(path.split('.'), obj);

		} else {
			exec('error Second argument of read should be an object.');
			callback();
		}
	},
	man: function() {
		return 'Extracts a value from json object. For example:\
		<br />Let\'s say that we have the following <i>object</i> - {data: { users: [10, 11, 12] }}\
		<br /><i>read data.users[1] object</i> will return 11\
		';
	}	
});