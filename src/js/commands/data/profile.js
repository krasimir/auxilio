var Profile = (function() {

	var _path = null;

	var evalJSCode = function(js, parameter, callback) {
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
	}
	var loadFile = function(path, callback) {
		exec("readfile " + path, function(content) {
			var js = content.replace(/\n/g, '').replace(/\r/g, '');
			evalJSCode(js, null, callback);
		});
	}
	var registerFile = function(path, callback) {
		exec("readfile " + path, function(content) {
			var js = content.replace(/\n/g, '').replace(/\r/g, '');
			var fileName = path.replace(/\\/g, '/').split('/').pop().split(".");
			fileName.pop();
			fileName = fileName.join(".");
			Commands.register(fileName, {
				requiredArguments: 0,
				format: 'profile method',
				lookForQuotes: true,
				concatArgs: true,
				run: function(args, callback) {
					evalJSCode(js, args, callback);
				},
				man: function() {
					return '<pre>profile method</pre>';
				}	
			});
			Autocomplete.prepareDictionary();
		});	
	}
	var loadOtherFiles = function() {
		var parts = _path.replace(/\\/g, '/').split("/");
		parts.pop();
		var dir = parts.join("/");
		var cwd = Context.get();
		exec("cd " + dir, function() {
			exec("tree -1 suppressdislay", function(res) {
				if(res && res.result) {
					var indexFile = _path.replace(/\\/g, '/').split('/').pop();
					var parseDir = function(childs, dir) {
						for(var f in childs) {
							if(f != indexFile) {
								if(typeof childs[f] === 'string') {
									registerFile(dir + "/" + f);
								} else {
									parseDir(childs[f], dir + "/" + f);
								}
							}
						}
					}
					parseDir(res.result, dir);	
				}
				exec("cd " + cwd);
			});
		});		
	}
	var init = function() {
		var onSocketConnect = function() {
			exec("profile", function(path) {
				if(path && path !== '') {
					_path = path.toString();
					loadOtherFiles();
					loadFile(_path);
				}
			});
			Shell.socket().removeListener("updatecontext", onSocketConnect);
		}
		Shell.socket().on("updatecontext", onSocketConnect);
	}

	return {
		init: init
	}

})();

Commands.register("profile", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	format: '<pre>profile [path]</pre>',
	run: function(args, callback) {
		var path = args.join(" ");
		var self = this;
		if(path === '') {
			exec("storage get profiledata", function(data) {
				if(data.profiledata && data.profiledata !== "") {
					callback(data.profiledata);
				} else {
					exec('info There is no profile set.');
					callback(null);
				}
			});
		} else if(path === 'clear') {
			exec("storage remove profiledata " + path, function() {				
				exec('success Profile removed.', callback);
			});
		} else {
			exec("storage put profiledata " + path, function() {
				Profile.init();
				exec('success Profile changed successfully.', callback);
			});
		}
	},
	man: function() {
		return 'Manages your current profile file.\
		If you pass <i>clear</i> the profile will be not active next time when you launch auxilio.\
		';
	}	
})