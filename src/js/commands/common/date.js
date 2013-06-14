Commands.register("date", {
	requiredArguments: 0,
	format: '<pre>date</pre>',
	run: function(args, callback) {
		var currentDate = new Date();
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var str = '';
		str += currentDate.getDate() + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear();
		str += ' ';
		str += this.formatDigit(currentDate.getHours()) + ":" + this.formatDigit(currentDate.getMinutes());
		callback(str);
	},
	formatDigit: function(d) {
		if(d < 10) {
			return "0" + d;
		} else {
			return d;
		}
	},
	man: function() {
		return 'Gets the current date.';
	}	
})