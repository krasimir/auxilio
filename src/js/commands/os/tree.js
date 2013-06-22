var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	format: '<pre>tree [dir] [filter] [ignore]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var dir = args.length > 0 ? args.shift() : '';
		var filter = args.length > 0 ? args.shift() : false;
		var ignore = args.length > 0 ? args.shift() : false;
		if(Shell.connected() && Shell.socket()) {
			var onTreeDataReceived = function(res) {
				Shell.socket().removeListener("tree", onTreeDataReceived);
				if(res.result) self.formatResult(res.result, filter, ignore);
				callback();
			}
			Shell.socket().on("tree", onTreeDataReceived);
			Shell.socket().emit("tree", {dir: dir});
		} else {
			exec("error The shell is currently not availalble.");
			callback();
		}
	},
	formatResult: function(dirs, filter, ignore) {

		var result = '',
			self = this;

		ignore = ignore ? ignore.replace(/, /g, ',').split(',') : false;
		var isItIgnored = function(name) {
			if(!ignore) return true;
			for(var i=0; nameToIgnore = ignore[i]; i++) {
				if(nameToIgnore === name) return true;
			}
			return false;
		}

		var formatItem = function(name, item, skipIndenting) {
			var res = '',
				filterMatch = null;
			if(filter && filter != '*') {
				var r = new RegExp('(' + filter + ')', 'gi');
				if(filterMatch = name.match(r)) {
					name = name.replace(r, '<span class="tree-filter-match">$1</span>');
				}
			}
			res += '<div class="' + (skipIndenting ? 'tree-wrapper' : 'tree-wrapper tree-wrapper-indent') + '">';
			if(typeof item == "object") { // directory
				var subfolders = !self.isEmpty(item);
				res += '\
					<div class="tree-item' + (filterMatch ? ' tree-item-filter-match' : '') + '">\
						<a href=""><span>\
						<i class="icon-folder' + (subfolders ? '-open' : '') + '"></i>\
						' + name + '</span></a>\
					</div>\
				';
				for(var i in item) {
					res += formatItem(i, item[i]);
				}
			} else {  // file
				res += '\
					<div class="tree-item' + (filterMatch ? ' tree-item-filter-match' : '') + '">\
						<a href=""><span><i class="icon-right-open"></i>' + name + '</span></a>\
					</div>\
				';
			}
			res += '</div>';
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], true);
		}


		App.setOutputPanelContent('<div class="tree">' + result + '</div>');

	},
	isEmpty: function(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }
	    return true;
	},
	man: function() {
		return 'Shows a directory tree.<br />\
		dir - could be <i>./project/files/</i><br />\
		filter - just text or *<br />\
		ignore - comma separated values. For example <i>node_modules,.libs</i><br />\
		Examples:<pre>\
tree ./ mod\n\
tree ./ * node_modules\n\
tree ./ myfile "node_modules, .git"\n\
tree ./ * "css, js"\
		</pre>\
		';
	}	
})