Commands.register("delay", {
	requiredArguments: 1,
	run: function(args, callback) {
		var interval = parseInt(args.shift());
		setTimeout(function() {
			callback();
		}, interval)
	},
	man: {
		desc: 'Delays the next command',
		format: 'delay [miliseconds]',
		examples: [
			{text: 'Command line', code: 'delay 2000'},
			{text: 'Command line (chaining)', code: 'echo A && delay 2000 && echo B'},
			{text: 'In script', code: 'delay(2000, function() {\n\
	console.log("hello");\n\
})'}
		],
		returns: 'null',
		group: 'common'
	}	
})