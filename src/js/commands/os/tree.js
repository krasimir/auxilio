Commands.register("tree", {
	requiredArguments: 0,
	format: '<pre>tree [dir]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var dir = args.length > 0 ? args.join(" ") : '';
		if(Shell.connected() && Shell.socket()) {
			Shell.socket().on("tree", function(res) {
				if(res.result) {
					self.formatResult(res.result);
				}
				callback();
			});
			Shell.socket().emit("tree", {dir: dir});
		} else {
			exec("error The shell is currently not availalble.");
			callback();
		}
	},
	formatResult: function(dirs) {

		var result = '';

		var calcIndent = function(n) {
			var res = '';
			for(var i=0; i<n; i++) res += '&nbsp;&nbsp;';
			return res;
		}
		var formatItem = function(name, item, indent) {
			var res = calcIndent(indent) + name + "<br />";
			for(var i in item) {
				res += formatItem(i, item[i], indent+1);
			}
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], 0);
		}

		exec("echo " + result);

	},
	man: function() {
		return 'Shows a directory tree.';
	}	
})