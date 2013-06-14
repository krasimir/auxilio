Commands.register("delay", {
	requiredArguments: 1,
	format: '<pre>delay [miliseconds]</pre>',
	run: function(args, callback) {
		var interval = parseInt(args.shift());
		setTimeout(function() {
			callback();
		}, interval)
	},
	man: function() {
		return 'Delay the next command. For example<br />\
		echo A &amp;&amp; delay 2000 &amp;&amp; echo B\
		';
	}	
})