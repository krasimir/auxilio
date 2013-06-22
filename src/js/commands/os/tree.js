var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	format: '<pre>tree [dir]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var dir = args.length > 0 ? args.join(" ") : '';
		if(Shell.connected() && Shell.socket()) {
			if(!TreeCommandIsSoketAdded) {
				TreeCommandIsSoketAdded = true;
				Shell.socket().on("tree", function(res) {
					if(res.result) {
						self.formatResult(res.result);
					}
					callback();
				});
			}
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
			for(var i=0; i<n; i++) res += '&nbsp;&nbsp;&nbsp;';
			return res;
		}
		var formatItem = function(name, item, indent) {
			var res = '<div class="tree-item"><a href="">' + calcIndent(indent) + '<span>+' + name + '</span></a></div>';
			var subfolders = false;
			if(typeof item == "object") {
				for(var i in item) {
					subfolders = true;
					res += formatItem(i, item[i], indent+1);
				}
				if(!subfolders) {
					res = res.replace('+', '');
				}
			} else {
				res = res.replace('+', '');
			}
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], 0);
		}

		App.setOutputPanelContent('<div class="tree">' + result + '</div>');

	},
	man: function() {
		return 'Shows a directory tree.';
	}	
})