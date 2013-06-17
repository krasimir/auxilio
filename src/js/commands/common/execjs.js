Commands.register("execjs", {
	requiredArguments: 2,
	format: '<pre>execjs [js function] [parameter]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var js = args.shift();
		var parameter = args.shift();
		try {
			eval("var auxilioFunction=" + js);
			if(typeof auxilioFunction !== "undefined") {
				auxilioFunction(parameter);
			}
		} catch(e) {
			exec("error Error executing<pre>" + js + "</pre>" + e.message);
		}
		callback();
	},
	man: function() {
		return 'Evals a javascript function. It is very useful to use the command together with others. Like for example:<br />\
		date &amp;&amp; execjs "function fName(date) { exec(\'echo \' + date); }"\
		';
	}	
})