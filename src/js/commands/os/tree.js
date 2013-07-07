var TreeCommandIsSoketAdded = false;
Commands.register("tree", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var self = this;
		var deep = -1;
		var regex = args.length > 0 ? args.shift() : '';
		var suppressdisplay = args.length > 0 ? args.shift() : false;
		regex = typeof regex != 'string' ? '' : regex;
		if(!isNaN(regex)) {
			deep = parseInt(regex);
			regex = '';
		}		
		if(Shell.connected() && Shell.socket()) {
			var onTreeDataReceived = function(res) {
				Shell.socket().removeListener("tree", onTreeDataReceived);
				if(suppressdisplay === false && res.result) {
					self.formatResult(res.result, regex, deep);
				}
				callback(res);
			}
			Shell.socket().on("tree", onTreeDataReceived);
			Shell.socket().emit("tree", {dir: './'});
		} else {
			NoShellError("tree: no shell");
			callback();
		}
	},
	formatResult: function(dirs, regex, deep) {

		var result = '',
			self = this,
			id = _.uniqueId("treeoutput");
			r = regex != '' ? new RegExp(regex, 'gi') : false;

		var formatItem = function(name, item, skipIndenting, path, currentDepth) {
			if(deep > 0 && currentDepth == deep) {
				return '';
			}
			var res = '',
				visible = regex != '' ? (path + '/' + name).match(r) : true;
			res += '<div class="' + (skipIndenting ? 'tree-wrapper' : 'tree-wrapper tree-wrapper-indent') + '">';
			if(typeof item == "object") { // directory
				var subfolders = !self.isEmpty(item);
				res += '\
					<div class="tree-item tree-item-dir' + (visible ? '' : ' tree-item-hidden') + '">\
						<a href="javascript:void(0);" class="goto" data-path="' + path + name + '"><span data-path="' + path + name + '">\
						<i class="icon-folder' + (subfolders ? '-open' : '') + '" data-path="' + path + name + '"></i>\
						' + name + '\
						</span></a>\
					</div>\
				';
				for(var i in item) {
					res += formatItem(i, item[i], false, path + name + "/", currentDepth+1);
				}
			} else {  // file
				var filePath = (Context.get().replace(/\\/g, '/') + '/' + path + name).replace(/\.\//g, '');
				res += '\
					<div class="tree-item tree-item-file' + (visible ? '' : ' tree-item-hidden') + '">\
						<a href="javascript:void(0)" class="goto" data-path="' + filePath + '" data-type="file">\
							<span data-path="' + filePath + '" data-type="file"><i class="icon-right-open"  data-type="file" data-path="' + filePath + '"></i>\
						' + name + '\
						</span></a>\
					</div>\
				';
			}
			res += '</div>';
			return res;
		}

		for(var name in dirs) {
			result += formatItem(name, dirs[name], true, './', 0);
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
	man: {
		desc: 'Shows a directory tree.',
		format: 'tree<br />tree [regex]<br />tree [deep]<br />tree [suppressdisplay]',
		examples: [
			{text: 'Command line', code: 'tree'},
			{text: 'Showing files by type', code: 'tree \\\.css'},
			{text: 'Showing only two levels', code: 'tree 2'},
			{text: 'Suppress the output to the console', code: 'tree suppressdisplay'},
			{text: 'In script', code: 'tree(2, function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})