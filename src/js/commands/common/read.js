Commands.register("read", {
	requiredArguments: 2,
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
	man: {
		desc: 'Extracts a value from json object',
		format: 'read [path] [json object]',
		examples: [
			{text: 'Command line (chaining)', code: 'date true && read day && success Today is '},
			{text: 'If you have a complex object like this one {data: { users: [10, 11, 12] }}', code: 'read data.users[1]'},
		],
		returns: 'Value of a property of the sent object',
		group: 'common'
	}	
});