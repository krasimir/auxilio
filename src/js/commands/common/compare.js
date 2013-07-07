Commands.register("compare", {
	requiredArguments: 4,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var title = args.shift();
		var value1 = this.prepareValue(args.shift().toString());
		var expression = args.shift();
		var value2 = this.prepareValue(args.shift().toString());
		var success = false;
		if(expression === "==" || expression === "===") {
			success = value1 === value2;
		} else if(expression === ">") {
			success = value1 > value2;
		} else if(expression === "<") {
			success = value1 < value2;
		} else if(expression === ">=") {
			success = value1 >= value2;
		} else if(expression === "<=") {
			success = value1 <= value2;
		} else if(expression === "!=" || expression === "!==") {
			success = value1 !== value2;
		} else {
			exec("error compare: Unrecognized expression. (" + expression + ")");
			callback(success);
			return;
		}
		if(success) {
			exec("success " + title + "<br />" + value1 + " " + expression + " " + value2);
		} else {
			exec("error " + title + "<br />" + value1 + " " + expression + " " + value2);
		}
		callback(success);
	},
	prepareValue: function(v) {
		if(isNaN(v) === true) {
			return v.toString();
		} else {
			return parseInt(v);
		}
	},
	man: {
		desc: 'Compares values. (Have in mind that it works only with strings and numbers.)',
		format: 'compare [title] [value1] [expression] [value2]',
		examples: [
			{text: 'Command line', code: 'compare "Check those values" 10 == 20'},
			{text: 'Command line (chaining)', code: 'date true && read monthName && compare "Is it July?" July =='},
			{text: 'In script', code: 'compare(\'"My title here"\', 10, "==", 10, function(res) {\n\
	console.log(res);\n\
})'},
		],
		returns: 'Boolean (true | false)',
		group: 'common'
	}
})