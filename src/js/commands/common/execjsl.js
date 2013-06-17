Commands.register("execjsl", {
	requiredArguments: 1,
	format: '<pre>execjsl [parameter]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		exec('formtextarea "Javascript code:"', function(command) {
			var js = command
			var parameter = args.shift();
			try {
				eval("var auxilioFunction=" + js);
				if(typeof auxilioFunction !== "undefined") {
					auxilioFunction(parameter);
				}
			} catch(e) {
				exec("error Error executing<pre>" + js + "</pre>" + e.message + "<pre>" + e.stack + "</pre>");
			}
			callback();
		});
	},
	man: function() {
		return 'Evals a javascript function. It is very useful to use the command together with others. Like for example:<br />\
		This version of the command openes a textarea for adding the javascript function.<br />\
		date &amp;&amp; execjs "function fName(date) { exec(\'echo \' + date); }"\
		';
	}	
})