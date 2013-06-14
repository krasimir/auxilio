var CommandParser = (function() {
	var parse = function(str, lookForQuotes) {
		var args = [];
		var readingPart = false;
		var part = '';
		for(var i=0; i<str.length; i++) {
			if(str.charAt(i) === ' ' && !readingPart) {
				args.push(part);
				part = '';
			} else {
				if(str.charAt(i) === '\"' && lookForQuotes) {
					readingPart = !readingPart;
				} else {
					part += str.charAt(i);
				}
			}
		}
		args.push(part);
		return args;
	}
	var getCommandName = function(str) {
		return str.split(" ").shift();
	}
	return {
		parse: parse,
		getCommandName: getCommandName
	}
})();