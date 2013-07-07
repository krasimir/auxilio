Commands.register("date", {
	requiredArguments: 0,
	format: '<pre></pre>',
	run: function(args, callback) {
		var asObject = args.length > 0 ? args.shift() === "true" : false;
		var currentDate = new Date();
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		if(asObject) { 
			callback({
				year: currentDate.getFullYear(),
				month: currentDate.getMonth(),
				monthName: months[currentDate.getMonth()],
				day: currentDate.getDate(),
				hour: currentDate.getHours(),
				minutes: currentDate.getMinutes()
			});
		} else {
			var str = '';
			str += currentDate.getDate() + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear();
			str += ' ';
			str += this.formatDigit(currentDate.getHours()) + ":" + this.formatDigit(currentDate.getMinutes());
			callback(str);
		}
	},
	formatDigit: function(d) {
		if(d < 10) {
			return "0" + d;
		} else {
			return d;
		}
	},
	man: {
		desc: 'Gets the current date.',
		format: 'date [true | false]',
		examples: [
			{text: 'Command line', code: 'date'},
			{text: 'Command line (chaining)', code: 'date true && read monthName && info'},
			{text: 'In script', code: 'date("true", function(date) {\n\
	console.log(date.year);\n\
})'}
		],
		returns: 'String if you use just <i>date</i> and object if use <i>data true</i><pre>6 July 2013 14:43</pre><pre>\
Object {\n\
	day: 6\n\
	hour: 14\n\
	minutes: 41\n\
	month: 6\n\
	monthName: "July"\n\
	year: 2013\n\
}\
		</pre>',
		group: 'common'
	}	
})