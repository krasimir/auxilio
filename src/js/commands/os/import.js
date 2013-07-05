Commands.register("import", {
	requiredArguments: 1,
	format: '<pre>import [path]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	totalFiles: 0,
	totalFilesProcessed: 0,
	run: function(args, callback) {

		var _path = args.join(" ");

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
			if(callback) callback(funcResult);
		}
		var execFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				}
				evalJSCode(js, null, callback);
			});
		}
		var registerFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				};
				var fileName = getFileName(path);
				Commands.register(fileName, {
					requiredArguments: 0,
					format: '',
					lookForQuotes: true,
					concatArgs: true,
					run: function(args, callback) {
						evalJSCode(js, args, callback);
					},
					man: function() {
						return '';
					}	
				});
				Autocomplete.prepareDictionary();
			});	
		}
		var loadFiles = function(callback) {
			var dir = _path;
			var cwd = Context.get();
			var self = this;
			Shell.suppressErrorsOnce(); // suppress the errors if cd to a file
			this.totalFiles = this.totalFilesProcessed = 0;
			exec("cd " + dir, function(res) {
				if(res.stderr && res.stderr != '') {
					// tries to import a specific file
					processFile(dir);
					callback();
				} else {
					exec("tree -1 suppressdislay", function(res) {
						if(res && res.result) {

							// counting files
							var count = function(files) {
								for(var f in files) {
									if(files[f] === "file") {
										self.totalFiles += 1;
									} else {
										count(files[f]);
									}
								}
							}
							count(res.result);

							// processing files
							var parseDir = function(childs, dir) {
								for(var f in childs) {
									if(typeof childs[f] === 'string') {
										processFile(dir + "/" + f, function() {
											self.totalFilesProcessed += 1;
											if(self.totalFilesProcessed === self.totalFiles) {
												callback(self.totalFilesProcessed);
											}
										});
									} else {
										parseDir(childs[f], dir + "/" + f);
									}
								}
							}
							exec("cd " + cwd, function() {
								parseDir(res.result, dir);
							});

						}
					});
				}
			});		
		}
		var getFileName = function(path) {
			var fileName = path.replace(/\\/g, '/').split('/').pop().split(".");
			fileName.pop();
			return fileName.join(".");
		}
		var processFile = function(filePath, callback) {
			var fileName = getFileName(filePath);
			if(fileName.indexOf("exec.") === 0) {
				execFile(filePath, callback);
			} else {
				registerFile(filePath, callback);
			}
		}

		loadFiles(callback);

	},
	man: function() {
		return 'Register or execute commands stored in external files. Accepts just a path.';
	}	
})