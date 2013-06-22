var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	format: '<pre>tree [regex]</pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var regex = args.length > 0 ? args.shift() : '';
		regex = typeof regex != 'string' ? '' : regex;
		if(Shell.connected() && Shell.socket()) {
			var onTreeDataReceived = function(res) {
				Shell.socket().removeListener("tree", onTreeDataReceived);
				if(res.result) self.formatResult(res.result, regex);
				callback();
			}
			Shell.socket().on("tree", onTreeDataReceived);
			Shell.socket().emit("tree", {dir: './'});
		} else {
			exec("error The shell is currently not availalble.");
			callback();
		}
	},
	formatResult: function(dirs, regex) {

		var result = '',
			self = this,
			id = _.uniqueId("treeoutput");
			r = regex != '' ? new RegExp(regex, 'gi') : false;

		var formatItem = function(name, item, skipIndenting, path) {
			if(r && !path.match(r) && path != './') return '';
			var res = '';			
			res += '<div class="' + (skipIndenting ? 'tree-wrapper' : 'tree-wrapper tree-wrapper-indent') + '">';
			if(typeof item == "object") { // directory
				var subfolders = !self.isEmpty(item);
				res += '\
					<div class="tree-item">\
						<a href="\
							javascript:exec(\'shell cd ' + path + name + ' && tree\');\
							document.getElementById(\'' + id + '\').style.display=\'none\';\
						"><span>\
						<i class="icon-folder' + (subfolders ? '-open' : '') + '"></i>\
						' + name + '</span></a>\
					</div>\
				';
				for(var i in item) {
					res += formatItem(i, item[i], false, path + name + "/");
				}
			} else {  // file
				var filePath = (Context.get().replace(/\\/g, '/') + '/' + path + name).replace(/\.\//g, '');
				res += '\
					<div class="tree-item">\
						<a href="javascript:exec(\'shell ' + filePath + '\');"><span><i class="icon-right-open"></i>' + name + '</span></a>\
					</div>\
				';
			}
			res += '</div>';
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], true, './');
		}

		App.setOutputPanelContent('<div class="tree" id="' + id + '">' + result + '</div>');

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
		regex - regular expression for filtering the output</i>\
		';
	}	
})