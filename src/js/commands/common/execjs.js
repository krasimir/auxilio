Commands.register("execjs", {
	requiredArguments: 2,
	format: '<pre>execjs [js function] [parameter]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var js = args.shift().replace(/\n/g, '');
		var parameter = args.shift();
		var self = this;
		js = ApplyVariables(js);
		if(js.toString().indexOf("function") === 0) {
			this.evalJSCode(js, parameter, callback);
		} else {
			exec(js, function(res) {
				if(typeof res == 'object') {
					res = res.join(' ');
				}
				self.evalJSCode(res.replace(/ && /g, '\n'), parameter, callback);
			});
		}
	},
	evalJSCode: function(js, parameter, callback) {
		var funcResult = null;
		try {
			eval("var auxilioFunction=" + js);
			if(typeof auxilioFunction !== "undefined") {
				funcResult = auxilioFunction(parameter);
			}
		} catch(e) {
			exec("error Error executing<pre>" + js + "</pre>" + e.message + "<pre>" + e.stack + "</pre>");
		}
		callback(funcResult);
	},
	man: function() {
		return 'Evals a javascript function. It is very useful to use the command together with others. Like for example:<br />\
		date &amp;&amp; execjs "function fName(date) { exec(\'echo \' + date); }"\
		[js function] could be also a regular command, like <i>inject</i> for example\
		';
	}	
})